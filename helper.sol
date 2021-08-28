// contract SnapshotHelper {
//     address private constant NFT_MANAGER = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;

//     function getReserves(
//         address pool,
//         uint128 liquidity,
//         uint256 tokenId
//     ) external view returns (uint256 amount0, uint256 amount1) {
//         (, , , , , int24 tickLower, int24 tickUpper, , , , , ) = INonfungiblePositionManager(NFT_MANAGER).positions(
//             tokenId
//         );
//         (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(pool).slot0();
//         uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
//         uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);

//         (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
//             sqrtPriceX96,
//             sqrtRatioAX96,
//             sqrtRatioBX96,
//             liquidity
//         );
//     }

//     function getTicks(uint256 tokenId) external view returns (int24 tickLower, int24 tickUpper) {
//         (, , , , , tickLower, tickUpper, , , , , ) = INonfungiblePositionManager(NFT_MANAGER).positions(tokenId);
//     }

//     function getPositionKey(
//         address _owner,
//         int24 _tickLower,
//         int24 _tickUpper
//     ) external pure returns (bytes32 positionKey) {
//         require(_owner != address(0), "SNAPSHOT_HELPER:: ZERO_ADDRESS");
//         positionKey = PositionKey.compute(_owner, _tickLower, _tickUpper);
//     }

//     function getPoolLiquidity(bytes32 _positionKey, address _pool) external view returns (uint128 liquidity) {
//         require(_pool != address(0), "SNAPSHOT_HELPER:: ZERO_ADDRESS");
//         (liquidity, , , , ) = IUniswapV3Pool(_pool).positions(_positionKey);
//     }
// }