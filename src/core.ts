import {
  Burn as BurnEvent,
  Mint as MintEvent,
  Initialize,
  Swap as SwapEvent,
  Flash as FlashEvent,
} from "../generated/templates/Pool/Pool";

import { PILOT_ADDRESS, POOL_ADDR } from "./utils/constants";

import {
  Pool,
  Snapshot,
  Token,
  User,
  UserReserveSnapshot,
} from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { createSnapshot, updateRangeStatus } from "./utils";

export function handleInitialize(event: Initialize): void {}

export function handleMint(event: MintEvent): void {
  
  if (event.block.number.gt(BigInt.fromI32(13061851))) {
    createSnapshot(event.block.timestamp);
    updateRangeStatus(event.block.timestamp);
  }
}

export function handleBurn(event: BurnEvent): void {
  if (event.block.number.gt(BigInt.fromI32(13061851))) {
    createSnapshot(event.block.timestamp);
    updateRangeStatus(event.block.timestamp);
  }
}

export function handleSwap(event: SwapEvent): void {
  if (event.block.number.gt(BigInt.fromI32(13061851))) {
    createSnapshot(event.block.timestamp);
    updateRangeStatus(event.block.timestamp);
  }
}

export function handleFlash(event: FlashEvent): void {
  if (event.block.number.gt(BigInt.fromI32(13061851))) {
    createSnapshot(event.block.timestamp);
    updateRangeStatus(event.block.timestamp);
  }
}
