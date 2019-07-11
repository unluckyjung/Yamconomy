Yamconomy
=========
# 1. What is Yamconomy?
## "Yamconomy" is a project focused at creating a wholesome review ecosystem using blockchain technology.

### 1.2 Diagram
![ex_screenshot](./img/설계도.png)

### 1.3 ecosystem
![ex_screenshot](./img/생태계.png)

### How to Run
	1. *truffle migrate --compile-all --reset --network ganache*	(If you want Run on Ganache with Compile & Reset)
	1-1. *truffle console --network ganache*	(Truffle console Run on Ganache)
	1-2. *Yamconomy.deployed().then(function(instance) {app = instance;})*	(Make Instance app)
	1-3. *app.FunctionName(Parameter)*
	
	2. Run CMD or Power Shell
	2-1 Go to Yamconomy path
	2-2 *npm install*	(Install Lite Server & DAPP Module)
	2-3 *npm run dev*		(Run DAPP with Lite Server)