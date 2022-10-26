import { providers } from 'ethers';
import { getAddress, hexValue } from 'ethers/lib/utils';
import { chain, Chain, Connector } from 'wagmi';
import { Magic, Extension } from 'magic-sdk';
import { ConnectExtension } from '@magic-ext/connect';

interface MagicConnectConnectorOptions {
  apiKey: string;
  rpcUrl?: string;
  testMode?: boolean;
  preload?: boolean;
  // extensions?: Extension[];
}

type MagicConnectSigner = providers.JsonRpcSigner;

type MagicConnectProvider = providers.Web3Provider;

interface MagicConnectConnectorConstructorParams {
  chains?: Chain[];
  options: MagicConnectConnectorOptions;
}

export class MagicConnectConnector extends Connector<
  MagicConnectProvider,
  MagicConnectConnectorOptions,
  MagicConnectSigner
> {
  readonly id = 'magicConnect';

  readonly name = 'MagicConnect';

  readonly ready = true;

  private provider?: providers.Web3Provider;

  // FIXME The extensions should be passed in here
  private magic?: Magic<ConnectExtension[]>;

  // constructor({ chains, options }: MagicConnectConnectorConstructorParams) {
  //   super({ chains, options })
  // };

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider({
        chainId,
        create: true,
      });

      this.attachListeners();

      // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available
      //
      // FIXME Okaaaay
      setTimeout(() => this.emit('message', { type: 'connecting' }), 0);

      const account = await this.getAccount();
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      return {
        account,
        chain: { id, unsupported },
        provider,
      };
    } catch (error) {
      console.error('Magic error', error);

      throw error;
    }
  }

  async disconnect() {
    await this.magic?.connect.disconnect();

    this.detachListeners();
    this.emit('disconnect');

    // FIXME What now
  }

  async getAccount(): Promise<string> {
    const provider = await this.getProvider();
    const accounts = await provider.listAccounts();

    // return checksum address
    //
    // FIXME It can actually be undefined
    return getAddress(accounts[0] as string);
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();

    return provider.network?.chainId;
  }

  async getProvider({
    chainId,
    create,
  }: { chainId?: number; create?: boolean } = {}) {
    if (
      !this.provider ||
      create ||
      (chainId != null && this.provider.network.chainId !== chainId)
    ) {
      this.detachListeners();

      // FIXME
      const rpcUrl =
        this.options.rpcUrl ??
        this.chains.find((chain) => chain.id === chainId)?.rpcUrls.default;

      if (chainId != null && !rpcUrl) {
        throw new Error('No RPC URL specified for chain');
      }

      const magic = (this.magic = new Magic(this.options.apiKey, {
        network:
          chainId == null
            ? 'mainnet'
            : chainId === chain.goerli.id
            ? 'goerli'
            : {
                chainId,
                rpcUrl: rpcUrl!,
              },
        extensions: [new ConnectExtension()],
        testMode: this.options.testMode,
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
    if (this.magic == null) return false;

    return await this.magic.user.isLoggedIn();
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
    this.emit('disconnect');
  };
}

const normalizeChainId = (chainId: string | number | bigint): number =>
  typeof chainId === 'string' ? parseInt(chainId) : Number(chainId);
