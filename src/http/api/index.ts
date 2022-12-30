import http from '@/http/Http.ts'

const network = localStorage.getItem('network') == null ? 'aptos_mainnet' : localStorage.getItem('network')

export async function login(data: { userName: string; password: string }) {
  return http.post(`/login`, data)
}

// node
export function getNodeList(data: any) {
  return http.get(`/v1/chain/${network}/node?page=${data.page}&count=${data.count}`)
}
export function getChainSummary(data: any) {
  return http.get(`/v1/chain/${network}/summary`)
}

// address account
export function getAddressList(data: any) {
  return http.get(`/v1/address/${network}/page/${data.page}?count=${data.count}`)
}
export function getAddressInfo(data: any) {
  return http.get(`/v1/address/${network}/${data.address}`)
}
export function getAddressResources(data: any) {
  return http.get(`/v1/address/${network}/${data.address}/resources`)
}

// block
export function getBlockHeight(data: any) {
  return http.get(`/v1/block/${network}/height/${data.height}`)
}
export function getBlockListStartHeight(data: any) {
  return http.get(`/v1/block/${network}/start_height/1?page=${data.page}&count=${data.count}`)
}
export function getBlockSummaryHash(data: any) {
  return http.get(`/v1/block/${network}/summary/${data.hash}`)
}
export function getBlockHash(data: any) {
  return http.get(`/v1/block/${network}/${data.id}`)
}
export function getBlockTransaction(data: any) {
  return http.get(`/v1/transaction/${network}/by_block/${data.hash}`)
}

// coin
export function getCoinList(data: any) {
  return http.get(`/v1/coin/${network}/page/${data.page}?count=${data.count}`)
}
export function getCoinHoldersList(data: any) {
  return http.get(`/v1/coin/${network}/holders/page/${data.page}?coin_id=${data.coin_id}&count=${data.count}`)
}
export function getCoinInfo(data: any) {
  return http.get(`/v1/coin/${network}/${data.coin_id}`)
}
// 首页MarketCap
export function getMarketCap(data: any) {
  return http.get(`/v1/coin/${network}/market_cap/${data.token}`)
}

// transaction // 0x310728596fce7d327ff85cc3faff6aeb4a3399e78ec03fffea82f937eb9fbf57
export function getTransactionListAddress(data: any) {
  return http.get(`/v1/transaction/${network}/by_address/${data.address}?count=${data.count}&page=${data.page}&with_event=${data.with_event}`)
}
export function getTransactionList(data: any) {
  return http.get(`/v1/transaction/${network}/page/${data.page}?count=${data.count}&start=${data.start}&txn_type=${data.txn_type}`)
}
// export function getTransactionHash(data: any) {
//   return http.get(`/v1/transaction/${network}/${data.hash}`)
// }
// export function getTransactionChanges(data: any) {
//   return http.get(`/v1/transaction/${network}/changes/${data.hash}`)
// }
export function getTransactionAggregated(data: any) {
  return http.get(`/v1/transaction/${network}/aggregated/${data.hash}`)
}

export function getTransactionVersion(data: any) {
  return http.get(`/v1/transaction/${network}/version/${data.version}`)
}

// transfer // 0x749e9feb6310ed23d5657e0a68e4db4a281fead2a2cca95b6810509e65d506b7
export function getTransferListAddress(data: any) {
  return http.get(`/v1/transfer/${network}/by_address/${data.address}`)
}
export function getTransferListTag(data: any) {
  return http.get(`/v1/transfer/${network}/by_tag/${data.type_tag}`)
}
export function getTransferList(data: any) {
  return http.get(`/v1/transfer/${network}/page/${data.page}?count=${data.count}&query_type=${data.query_type}`)
}

// 合约列表
export function contractAddress(data: any) {
  return http.get(`/v1/address/${network}/contract/list/${data.page}`)
}
export function contractAddressDetail(data: any) {
  return http.get(`/v1/address/${network}/contract/${data.address}`)
}
// NFT
export function nftTokenList(data: any) {
  return http.get(`/v1/token/${network}/page/${data.page}`)
}
export function nftTokenInfo(data: any) {
  return http.get(`/v1/token/${network}/${data.type_tag}`)
}
// 数据统计
export function transactionDay(data: any) {
  return http.get(`/v1/stat/${network}/txn/day/page/${data.page}`)
}
export function transactionHour(data: any) {
  return http.get(`/v1/stat/${network}/txn/hour/page/${data.page}`)
}
export function addressDay(data: any) {
  return http.get(`/v1/stat/${network}/addr/day/page/${data.page}`)
}
export function addressHour(data: any) {
  return http.get(`/v1/stat/${network}/addr/hour/page/${data.page}`)
}