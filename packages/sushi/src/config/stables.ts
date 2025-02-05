import { ChainId } from '../chain/index.js'
import {
  BASE_BRIDGE_USDC,
  BTTC_BSC_BRIDGE_USDC,
  BTTC_BSC_BRIDGE_USDT,
  BTTC_ETHEREUM_BRIDGE_USDC,
  BTTC_ETHEREUM_BRIDGE_USDT,
  BTTC_TRON_BRIDGE_USDC,
  BTTC_TRON_BRIDGE_USDT,
  BUSD,
  DAI,
  FRAX,
  LUSD,
  MIM,
  THUNDERCORE_ANY_BUSD,
  THUNDERCORE_ANY_USDC,
  THUNDERCORE_ANY_USDT,
  Token,
  USDC,
  USDT,
  USD_PLUS,
  WORMHOLE_USDC,
  ZETA_BSC_BRIDGE_USDC,
  ZETA_BSC_BRIDGE_USDT,
  ZETA_ETH_BRIDGE_USDC,
  ZETA_ETH_BRIDGE_USDT,
  axlUSDC,
} from '../currency/index.js'
import { STARGATE_USDC, STARGATE_USDT } from './stargate.js'

export const STABLES = {
  [ChainId.ARBITRUM]: [
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
    MIM[ChainId.ARBITRUM],
    FRAX[ChainId.ARBITRUM],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.AVALANCHE]: [
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    DAI[ChainId.AVALANCHE],
    MIM[ChainId.AVALANCHE],
    FRAX[ChainId.AVALANCHE],
  ],
  [ChainId.BASE]: [
    USDC[ChainId.BASE],
    DAI[ChainId.BASE],
    axlUSDC[ChainId.BASE],
    USD_PLUS[ChainId.BASE],
    BASE_BRIDGE_USDC,
  ],
  [ChainId.BOBA]: [USDC[ChainId.BOBA], USDT[ChainId.BOBA], DAI[ChainId.BOBA]],
  [ChainId.BOBA_AVAX]: [USDC[ChainId.BOBA_AVAX], USDT[ChainId.BOBA_AVAX]],
  [ChainId.BOBA_BNB]: [USDC[ChainId.BOBA_BNB], USDT[ChainId.BOBA_BNB]],
  [ChainId.BSC]: [
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    BUSD[ChainId.BSC],
    DAI[ChainId.BSC],
    MIM[ChainId.BSC],
    FRAX[ChainId.BSC],
  ],
  [ChainId.BTTC]: [
    USDC[ChainId.BTTC],
    USDT[ChainId.BTTC],
    BTTC_BSC_BRIDGE_USDC,
    BTTC_ETHEREUM_BRIDGE_USDC,
    BTTC_TRON_BRIDGE_USDC,
    BTTC_BSC_BRIDGE_USDT,
    BTTC_ETHEREUM_BRIDGE_USDT,
    BTTC_TRON_BRIDGE_USDT,
  ],
  [ChainId.CELO]: [USDC[ChainId.CELO], USDT[ChainId.CELO], DAI[ChainId.CELO]],
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
    MIM[ChainId.ETHEREUM],
    FRAX[ChainId.ETHEREUM],
  ],
  [ChainId.FANTOM]: [
    axlUSDC[ChainId.FANTOM],
    STARGATE_USDC[ChainId.FANTOM],
    STARGATE_USDT[ChainId.FANTOM],
    MIM[ChainId.FANTOM],
    FRAX[ChainId.FANTOM],
  ],
  [ChainId.FILECOIN]: [USDC[ChainId.FILECOIN], DAI[ChainId.FILECOIN]],
  [ChainId.FUSE]: [USDC[ChainId.FUSE], USDT[ChainId.FUSE], DAI[ChainId.FUSE]],
  [ChainId.GNOSIS]: [
    USDC[ChainId.GNOSIS],
    USDT[ChainId.GNOSIS],
    DAI[ChainId.GNOSIS],
  ],
  [ChainId.HARMONY]: [
    USDC[ChainId.HARMONY],
    USDT[ChainId.HARMONY],
    DAI[ChainId.HARMONY],
    FRAX[ChainId.HARMONY],
  ],
  [ChainId.HAQQ]: [USDC[ChainId.HAQQ], USDT[ChainId.HAQQ], DAI[ChainId.HAQQ]],
  [ChainId.HECO]: [USDC[ChainId.HECO], USDT[ChainId.HECO], DAI[ChainId.HECO]],
  [ChainId.KAVA]: [axlUSDC[ChainId.KAVA], USDT[ChainId.KAVA]],
  [ChainId.LINEA]: [USDC[ChainId.LINEA], DAI[ChainId.LINEA]],
  [ChainId.METIS]: [
    USDC[ChainId.METIS],
    USDT[ChainId.METIS],
    DAI[ChainId.METIS],
  ],
  [ChainId.MOONBEAM]: [
    WORMHOLE_USDC[ChainId.MOONBEAM],
    axlUSDC[ChainId.MOONBEAM],
    FRAX[ChainId.MOONBEAM],
    new Token({
      chainId: ChainId.MOONBEAM,
      address: '0xFFfffffF7D2B0B761Af01Ca8e25242976ac0aD7D',
      decimals: 6,
      name: 'USD Coin',
      symbol: 'xcUSDC',
    }),
    new Token({
      chainId: ChainId.MOONBEAM,
      address: '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d',
      decimals: 6,
      name: 'Tether USD',
      symbol: 'xcUSDT',
    }),
  ],
  [ChainId.MOONRIVER]: [
    USDC[ChainId.MOONRIVER],
    USDT[ChainId.MOONRIVER],
    DAI[ChainId.MOONRIVER],
    MIM[ChainId.MOONRIVER],
    FRAX[ChainId.MOONRIVER],
  ],
  [ChainId.OKEX]: [USDC[ChainId.OKEX], USDT[ChainId.OKEX], DAI[ChainId.OKEX]],
  [ChainId.OPTIMISM]: [
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
    FRAX[ChainId.OPTIMISM],
  ],
  [ChainId.POLYGON]: [
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
    MIM[ChainId.POLYGON],
    FRAX[ChainId.POLYGON],
  ],
  [ChainId.POLYGON_ZKEVM]: [
    USDC[ChainId.POLYGON_ZKEVM],
    USDT[ChainId.POLYGON_ZKEVM],
    DAI[ChainId.POLYGON_ZKEVM],
  ],
  [ChainId.SCROLL]: [
    USDC[ChainId.SCROLL],
    USDT[ChainId.SCROLL],
    DAI[ChainId.SCROLL],
  ],
  [ChainId.TELOS]: [USDC[ChainId.TELOS], USDT[ChainId.TELOS]],
  [ChainId.THUNDERCORE]: [
    USDC[ChainId.THUNDERCORE],
    USDT[ChainId.THUNDERCORE],
    BUSD[ChainId.THUNDERCORE],
    THUNDERCORE_ANY_BUSD,
    THUNDERCORE_ANY_USDT,
    THUNDERCORE_ANY_USDC,
  ],
  [ChainId.CORE]: [USDC[ChainId.CORE], USDT[ChainId.CORE]],
  [ChainId.ZETACHAIN]: [
    ZETA_BSC_BRIDGE_USDC,
    ZETA_BSC_BRIDGE_USDT,
    ZETA_ETH_BRIDGE_USDC,
    ZETA_ETH_BRIDGE_USDT,
  ],
  [ChainId.CRONOS]: [USDC[ChainId.CRONOS]],
  // TESTNETS
  [ChainId.RINKEBY]: [USDC[ChainId.RINKEBY]],
  [ChainId.ROPSTEN]: [
    USDC[ChainId.ROPSTEN],
    USDT[ChainId.ROPSTEN],
    DAI[ChainId.ROPSTEN],
  ],
  [ChainId.KOVAN]: [
    USDC[ChainId.KOVAN],
    USDT[ChainId.KOVAN],
    DAI[ChainId.KOVAN],
  ],
  [ChainId.POLYGON_TESTNET]: [USDC[ChainId.POLYGON_TESTNET]],
} as const
