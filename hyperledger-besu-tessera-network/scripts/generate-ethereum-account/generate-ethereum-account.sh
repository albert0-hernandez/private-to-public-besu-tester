#!/bin/bash
#Original script can be found here https://gist.github.com/ignition42/62f0542969a43c02557f6bf84b7f057b

function setup_keccak256sum {
    echo "[INFO] Downloading keccak-256sum..."
    if [ $(uname -m) == 'x86_64' ]; then
        curl -L -O https://github.com/vkobel/ethereum-generate-wallet/raw/master/lib/x86-64/keccak-256sum
    else
        curl -L -O https://github.com/vkobel/ethereum-generate-wallet/raw/master/lib/i386/keccak-256sum
    fi

    chmod +x keccak-256sum
}

# Source: https://kobl.one/blog/create-full-ethereum-keypair-and-address/

# Install dependencies
echo "[INFO] Installing/updating dependencies..."
sudo apt-get install openssl curl -y

# Download prebuilt sha3 keccak if it not exist

if [[ ! -f "keccak-256sum" ]]
then
    setup_keccak256sum
fi

export PATH=$PATH:$(pwd)

echo "[INFO] Creating account..."
keys=$(openssl ecparam -name secp256k1 -genkey -noout | openssl ec -text -noout 2> /dev/null)

# extract private key in hex format, removing newlines, leading zeroes and semicolon 
priv=$(printf "%s\n" $keys | grep priv -A 3 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^00//')

# extract public key in hex format, removing newlines, leading '04' and semicolon 
pub=$(printf "%s\n" $keys | grep pub -A 5 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^04//')

# get the keecak hash, removing the trailing ' -' and taking the last 40 chars
# https://github.com/maandree/sha3sum
addr=0x$(echo $pub | keccak-256sum -x -l | tr -d ' -' | tail -c 41) 

echo 'Private key:' $priv
echo 'Public key: ' $pub
echo 'Address:    ' $addr

FOLDER=${1:-"."}
echo "Writing info to files in folder $FOLDER"
echo $priv > $FOLDER/priv
echo $pub > $FOLDER/pub
echo $addr > $FOLDER/address