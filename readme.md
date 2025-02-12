# Avalanche private chain

L'objectif de ce processus était de déployer une nouvelle blockchain personnalisée (Subnet) sur le réseau de test Fuji Testnet d'Avalanche. Cela a inclus la configuration des clés, le transfert de fonds entre les différentes chaînes (C-Chain, P-Chain et X-Chain), la configuration des nœuds locaux et la modification du fichier de configuration genesis.json.

## Authors

- [@Coralie Boyer](https://github.com/CocoLaDev/)
- [@Agustin Gomez Del Toro](https://github.com/AgustinGomezDelToro)

## Installation

### Clone this repos with

```bash
git clone https://github.com/CocoLaDev/avalanche-private-chain.git
```

## Contracts

```bash
cd avalanche-projet-nft
```

### Build the contracts with

```bash
cd avalanche-projet-nft
forge build
```

### Run the tests with

```bash
forge test
```


### Check the coverage with

```bash
forge coverage
```

## Front

### Build the contracts with

```bash
cd avalanche-projet-nft
forge build
```

### Run the projet with

```bash
npm run dev
```
Or
```bash
npm start
```