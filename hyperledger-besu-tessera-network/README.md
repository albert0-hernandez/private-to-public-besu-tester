# Introduction
This is a besu network used for test purposes. It is composed by 1 validator an 2 regular nodes. The regular nodes have privacy enabled, as well as onchain privacy groups. Each regular node has its own Tessera enclave.

# Prerequisites
- Docker
- Docker compose

# Run the network

From the root folder:

`./run.sh`

# Create privacy groups

After running the network, you can create a privacy group. The following instructions will create an onchain privacy groups with a defined ID.
The script uses the same configuration stored in the config/peers folder, so if the configuration were to be updated, so should be the script. 

```
cd scripts/setup-privacy-groups
npm install
node index.js
```

# Stop the network

`./stop.sh`

# JVM options in nodes

To allow the analysis of node performance, all besu nodes have the following JVM options set by default, set in file config/templates/docker-compose-microservices.yaml, line 16. With this configuration, external tools such as JVisualVM can be connected to the JMX port, in order to obtain different metrics.

`-Xms2G -Xmx4G -XX:NewRatio=1 -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=8888 -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false`

By default, only node0 has the port 8888 opened.
