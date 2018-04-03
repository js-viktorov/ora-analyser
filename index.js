log=console.log;

var fs = require('fs');
var path = require('path');

var express = require('express');
var compression = require('compression');

var RESOURCE_MAX_AGE_SECONDS = 24*60*60;

var app = express();

app.use(compression());

process.on('unhandledRejection',log);

function readFile(path){
	return new Promise((resolve,reject)=>fs.readFile(path,(e,r)=>(e)?reject(e):resolve(r)));
}

function readFileFromModule(module,relativePath){
	return readFile(path.dirname(require.resolve(module))+relativePath);
}

app.get('/res/js/lib/react-base.js',(()=>{
	var loadReactBase = Promise.all(
		[['react','/umd/react.production.min.js'],['react-dom','/umd/react-dom.production.min.js']].map(([m,p])=>readFileFromModule(m,p))
	).then(Buffer.concat);
	return function(req,res){
		loadReactBase.then((b)=>res.set({'Cache-Control': 'public, max-age='+RESOURCE_MAX_AGE_SECONDS}).type('text/javascript').end(b));
	};
})());


app.use('/res/jsx',express.static(process.env.BUILTJSXPATH || 'built-jsx',{maxage:RESOURCE_MAX_AGE_SECONDS*1000}));
app.use('/res',express.static('res',{maxage:RESOURCE_MAX_AGE_SECONDS*1000}));

app.get('/',(req,res)=>res.sendFile(__dirname+'/index.html'));

app.use((req,res)=>{
	log(req.path + ' Missed');
	res.status(404);
	res.end();
})

var PORT = process.env.PORT || 8080;

app.listen(PORT,()=>log(`up http://localhost:${PORT}`));
