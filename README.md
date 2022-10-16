# MoveScan
Open source blockchain explorer for Move Lang ecosystem

## About MoveScan
MoveScan aims to build a common explorer framework for Move Lang ecosystem, providing the basic functions of a explorer for public blockchains such as STARCOIN, APTOS, SUI, etc.
Including basic queries such as blocks, transactions and addresses, as well as the parsing and verification of smart contracts.


## MoveScan Functions
- Basic functions of the explorer
<p>
    Support basic queries and display of blocks, transactions, resources, token, addresses, etc.
</p> 

- Featured functions
  - Parse and verify MOVE smart contracts code
  - Data statistics
  - Trace function of transaction or address

## MoveScan Development Plan
    MoveScan has already supported STARCOIN, and is making architectural adjustments to support other public blockchains in the MOVE ecosystem, divided into the following milestones to achieve in stages.
1. Milestone 1
- Refactor the existing framework, sink the common functions and increase the adaptation layer to support multiple chains
- Adaptation implements of APTOS chain
- Adaptation implements of SUI chain
2. Milestone 2
- Improve the front-end framework packaging to support contract code parsing and verification
- Support MOVE language difference adaptation of APTOS
- Support MOVE language difference adaptation of SUI
3. Milestone 3
- Support transaction data statistics and chart display
- Support trace function based on transaction/address



## License
MoveScan is licensed as [Apache 2.0](./LICENSE).