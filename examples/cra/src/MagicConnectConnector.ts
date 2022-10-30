import { providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { Chain, chain, Connector, UserRejectedRequestError } from 'wagmi';
import { EthNetworkConfiguration, Magic, RPCError } from 'magic-sdk';
import { ConnectExtension } from '@magic-ext/connect';

interface MagicConnectConnectorOptions {
  apiKey: string;
  chain: Chain;
  preload?: boolean;
}

type MagicConnectSigner = providers.JsonRpcSigner;

type MagicConnectProvider = providers.Web3Provider;

export class MagicConnectConnector extends Connector<
  MagicConnectProvider,
  MagicConnectConnectorOptions,
  MagicConnectSigner
> {
  private readonly magicNetworksByChainId: Map<
    Chain['id'],
    EthNetworkConfiguration
  > = new Map([
    [chain.mainnet.id, 'mainnet'],
    [chain.goerli.id, 'goerli'],
  ]);

  // This needs to match the id in connectkitx
  readonly id = 'magic';

  readonly name = 'MagicConnect';

  readonly ready = true;

  private provider?: providers.Web3Provider;

  // FIXME The extensions should be passed in here
  private magic?: Magic<ConnectExtension[]>;

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider({
        chainId,
        create: true,
      });

      this.attachListeners();

      // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available
      setTimeout(() => this.emit('message', { type: 'connecting' }), 0);

      const account = await this.getAccount();
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      this.setConnectedTime(Date.now());

      return {
        account,
        chain: { id, unsupported },
        provider,
      };
    } catch (error) {
      if (error instanceof RPCError) {
        if (USER_REJECTED_MESSAGE_PATTERN.test(error.message ?? '')) {
          throw new UserRejectedRequestError(error);
        }
      }

      throw error;
    }
  }

  async disconnect() {
    await this.magic?.connect.disconnect();

    this.setConnectedTime(undefined);

    this.detachListeners();
    this.emit('disconnect');

    // FIXME What now
  }

  async getAccount(): Promise<`0x${string}`> {
    const provider = await this.getProvider();
    const accounts = await provider.listAccounts();

    // return checksum address
    //
    // FIXME It can actually be undefined
    return getAddress(accounts[0]) as `0x${string}`;
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();

    return provider.network?.chainId;
  }

  async getProvider({
    chainId = this.options.chain.id,
    create,
  }: { chainId?: number; create?: boolean } = {}) {
    if (!this.provider || create || this.provider.network.chainId !== chainId) {
      this.detachListeners();

      const network = this.magicNetworksByChainId.get(chainId);
      if (!network) {
        throw new Error(`Invalid chainId: ${chainId}`);
      }

      const magic = (this.magic = new Magic(this.options.apiKey, {
        network,
        extensions: [new ConnectExtension()],
      }));

      if (this.options.preload) await magic.preload();

      // FIXME Is it a real issue or just TypeScript?
      this.provider = new providers.Web3Provider(magic.rpcProvider as any);

      await this.provider.ready;
    }

    return this.provider;
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const provider = await this.getProvider({ chainId });
    const account = await this.getAccount();

    return provider.getSigner(account);
  }

  async isAuthorized() {
    const connectedTime = this.getConnectedTime();
    if (connectedTime == null) return false;

    return Date.now() - connectedTime < CONNECT_DURATION;
  }

  async switchChain(chainId: number) {
    const provider = await this.getProvider({ chainId });

    return this.chains.find((chain) => chain.id === chainId)!;
  }

  private attachListeners() {
    this.provider?.addListener('accountsChanged', this.onAccountsChanged);
    this.provider?.addListener('chainChanged', this.onChainChanged);
    this.provider?.addListener('disconnect', this.onDisconnect);
  }

  private detachListeners() {
    this.provider?.removeListener('accountsChanged', this.onAccountsChanged);
    this.provider?.removeListener('chainChanged', this.onChainChanged);
    this.provider?.removeListener('disconnect', this.onDisconnect);
  }

  protected isChainUnsupported(chainId: number): boolean {
    return this.magicNetworksByChainId.get(chainId) == null;
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: getAddress(accounts[0] as string) });
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);

    // FIXME What chains do we support????
    const unsupported = this.isChainUnsupported(id);

    this.emit('change', { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.setConnectedTime(undefined);
    this.emit('disconnect');
  };

  private getConnectedTime(): number | undefined {
    try {
      const connectedTimeAsString =
        window.localStorage.getItem(CONNECTED_TIME_KEY);
      if (connectedTimeAsString == null) return undefined;

      const connectedTime = parseInt(connectedTimeAsString);
      if (isNaN(connectedTime)) return undefined;

      return connectedTime;
    } catch {}
  }

  private setConnectedTime(value: number | undefined) {
    try {
      if (value == null) {
        window.localStorage.removeItem(CONNECTED_TIME_KEY);
      } else {
        window.localStorage.setItem(CONNECTED_TIME_KEY, value.toString());
      }
    } catch {}
  }
}

const normalizeChainId = (chainId: string | number | bigint): number =>
  typeof chainId === 'string' ? parseInt(chainId) : Number(chainId);

const USER_REJECTED_MESSAGE_PATTERN = /user rejected/i;

const CONNECTED_TIME_KEY = 'xyz.9999in1.connectedTime';
const CONNECT_DURATION = 7 * 86400 * 1000;
