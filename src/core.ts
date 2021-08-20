import {
  Burn as BurnEvent,
  Mint as MintEvent,
  Initialize,
  Swap as SwapEvent,
  Flash as FlashEvent,
} from "../generated/templates/Pool/Pool";

import { PILOT_ADDRESS } from "./utils/constants";

import {
  Pool,
  Snapshot,
  Token,
  User,
  UserReserveSnapshot,
} from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function handleInitialize(event: Initialize): void {}

export function handleMint(event: MintEvent): void {
}

export function handleBurn(event: BurnEvent): void {}

export function handleSwap(event: SwapEvent): void {}

export function handleFlash(event: FlashEvent): void {}
