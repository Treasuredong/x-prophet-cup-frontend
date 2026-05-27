import type { Abi } from "viem";

export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_X_PROPHET_CUP_ADDRESS as `0x${string}` | undefined) ??
  "0x0000000000000000000000000000000000000000";

export type ContractMarketTuple = readonly [
  string,
  string,
  bigint,
  bigint,
  number,
  number,
  boolean,
  number,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  readonly [bigint, bigint, bigint]
];

export type ContractPositionTuple = readonly [number, number, boolean, boolean, bigint, bigint, bigint];

export const X_PROPHET_CUP_ABI = [
  {
    type: "error",
    name: "DeadlineNotFuture",
    inputs: []
  },
  {
    type: "error",
    name: "DeadlineMustPrecedeKickoff",
    inputs: []
  },
  {
    type: "error",
    name: "InvalidMarket",
    inputs: []
  },
  {
    type: "error",
    name: "InvalidOutcome",
    inputs: []
  },
  {
    type: "error",
    name: "InvalidTribe",
    inputs: []
  },
  {
    type: "error",
    name: "MarketClosed",
    inputs: []
  },
  {
    type: "error",
    name: "ResolveTooEarly",
    inputs: []
  },
  {
    type: "error",
    name: "PositionExists",
    inputs: []
  },
  {
    type: "error",
    name: "StakeMustBePositive",
    inputs: []
  },
  {
    type: "error",
    name: "MarketNotResolved",
    inputs: []
  },
  {
    type: "error",
    name: "PositionMissing",
    inputs: []
  },
  {
    type: "error",
    name: "AlreadySettled",
    inputs: []
  },
  {
    type: "error",
    name: "InsufficientAccruedBalance",
    inputs: []
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "marketCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "userStreak",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "userBestStreak",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "hasMintedProphet",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "getMarket",
    stateMutability: "view",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      { name: "slug", type: "string" },
      { name: "matchInfo", type: "string" },
      { name: "kickoff", type: "uint64" },
      { name: "deadline", type: "uint64" },
      { name: "homeTribe", type: "uint8" },
      { name: "awayTribe", type: "uint8" },
      { name: "resolved", type: "bool" },
      { name: "winningOutcome", type: "uint8" },
      { name: "rewardPool", type: "uint256" },
      { name: "hypePool", type: "uint256" },
      { name: "protocolFeePool", type: "uint256" },
      { name: "growthPool", type: "uint256" },
      { name: "totalVolume", type: "uint256" },
      { name: "outcomeWeights", type: "uint256[3]" }
    ]
  },
  {
    type: "function",
    name: "getPosition",
    stateMutability: "view",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" }
    ],
    outputs: [
      { name: "outcome", type: "uint8" },
      { name: "tribeId", type: "uint8" },
      { name: "isHype", type: "bool" },
      { name: "settled", type: "bool" },
      { name: "grossStake", type: "uint256" },
      { name: "prizeStake", type: "uint256" },
      { name: "weightedStake", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "tribeFeePool",
    stateMutability: "view",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint8" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "placeBet",
    stateMutability: "payable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcome", type: "uint8" },
      { name: "tribeId", type: "uint8" },
      { name: "isHype", type: "bool" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "settlePosition",
    stateMutability: "nonpayable",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [{ name: "reward", type: "uint256" }]
  },
  {
    type: "function",
    name: "createMarket",
    stateMutability: "nonpayable",
    inputs: [
      { name: "slug", type: "string" },
      { name: "matchInfo", type: "string" },
      { name: "kickoff", type: "uint64" },
      { name: "deadline", type: "uint64" },
      { name: "homeTribe", type: "uint8" },
      { name: "awayTribe", type: "uint8" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "resolveMarket",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "winningOutcome", type: "uint8" }
    ],
    outputs: []
  }
] as const satisfies Abi;
