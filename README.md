# Mini Ethereum Explorer
Simple explorer to real time tracking and recording Ethereum and its token transfer

## What and why is this?
This is not etherscan mini version and ofcourse its not going to beat etherscan any time very soon,its just a worker which 
can help you to keep an eye on you account related ether and token transfer.

And why? because some time I need a transaction record of list of my user regarding to ether and token transfer, yes you can query on etherscan or ethexplorer but its time consuming and it can reach limit access.

And its good this can also real time notify for incomming transaction to your account too. 

## App Structure
![mini explorer ETH drawio](https://user-images.githubusercontent.com/7260527/218645994-1b1b6a79-4d0a-4e3e-a11a-21faf2586795.png)

                                                        App Structure
                                                      
There are 2 compenents here, 1 master and few workers, it communicate via rabbitMQ
- `Master` : query block data from blockchain, and send transaction payload to workers

For sake of simplicity I use the `Infura` public endpoint but at the time of writing this, Infura only accept 100k request perday for 1 free account.

- `Worker` : filter transaction payload to know if transaction is sending to registed user, if yes then save transaction to local DB and notify user

The `Master` and `workers` communicate via message queue, so its scalable friendly interm of using programming languagues.

## How to use?
Its very straight forward, user just need subscribe/ubsubscribe his/her account address via public api.

## Dependencies
- RabbitMQ - comunication between the `master` and `worker` services
- Redis - to cache latest query block
- MongoDB - persistance data to save transaction and user
## Installation
Create .env file, please refer file env-template

```bash
npm i
```
run master
```bash
node ./src/app.js
```
run woker
```bash
node ./src/worker.js
```

## Project Status
Its under heavy development

## TODO
- Split out source code master and worker
- Document api
- Real time notify email or socket

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
