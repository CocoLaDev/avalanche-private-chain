Étapes Réalisées
1. Création de la Subnet
- Nous avons commencé par créer une nouvelle subnet appelée ESGI avec la commande :
```bash
./avalanche subnet create ESGI
```
- Pendant cette étape, des options nous ont été proposées pour définir certains paramètres, tels que :
    - Le nom de la subnet.
    - La spécification de la chaîne (P-Chain).
    - Les options de validation et de configuration initiale.
2. Déploiement initial du réseau
- Nous avons déployé le réseau local avec la commande :
```bash
./avalanche network deploy ESGI
```
- Il nous a été demandé de choisir entre utiliser un nœud local ou configurer un nœud sur un service cloud (par exemple AWS ou GCP). Nous avons choisi d'utiliser un nœud local.
- Le processus a installé et démarré la version avalanchego requise pour ce déploiement.
3. Création des clés
- Nous avons créé une clé pour le projet en utilisant la commande :
```bash
./avalanche key create projet-coco-agustin
```
- Cette clé a été utilisée pour toutes les transactions ultérieures et pour définir la propriété des fonds et contrats sur la subnet.
4. Description de la Subnet
- Pour obtenir plus d'informations sur la subnet créée, nous avons exécuté :
```bash
./avalanche subnet describe ESGI
```
- Cela nous a montré les détails techniques, tels que l'identifiant de la subnet, les chaînes associées et la configuration des validateurs.
5. Modification du fichier genesis.json
- Nous avons ouvert et modifié le fichier genesis.json afin de nous assurer que le solde initial de AVAX était configuré correctement sur l'adresse correspondante de Metamask.
```bash
sudo nano ~/.avalanche-cli/subnets/ESGI/genesis.json
```
- Nous avons mis à jour la configuration du bloc alloc pour que le solde initial soit uniquement attribué à notre adresse :
```json
"alloc": {
    "351024a4ec50612c8d1cf70cd508f77f37da53f8": {
        "balance": "0x8ac7230489e80000"
    }
}
```
- Ainsi, seule l'adresse 0x351024A4EC50612C8D1CF70cd508F77f37Da53F8 disposera du solde initial.
6. Transfert de fonds vers la P-Chain
- Initialement, les fonds étaient sur la C-Chain. Pour pouvoir effectuer des opérations sur la subnet, nous avons déplacé les fonds vers la P-Chain.
- Nous avons utilisé la commande suivante :
```bash
./avalanche key transfer --key projet-coco-agustin --amount 0.1 --sender-blockchain X --receiver-blockchain P --testnet
```
- Nous avons vérifié les soldes avec :
```bash
./avalanche key list
```
7. Déploiement de la Blockchain Personnalisée
- Enfin, nous avons déployé la blockchain ESGI sur le réseau de test Fuji :
```bash
./avalanche blockchain deploy ESGI --testnet
```
- Il nous a été demandé de confirmer si nous souhaitions utiliser notre machine locale comme validateur bootstrap. Nous avons sélectionné l'option Yes.
- Le nœud local a été confirmé comme opérationnel et en cours de synchronisation avec le réseau Fuji.
- Nous avons surveillé l'état du déploiement via le fichier de logs :
```bash
tail -f /Users/agustingomezdeltoro/.avalanche-cli/local/ESGI-local-node-fuji/server.log
```
- Nous avons vérifié l'état du nœud avec :
```bash
./avalanche network status ESGI-local-node-fuji
```