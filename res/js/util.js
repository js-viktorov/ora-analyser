window.log=console.log;

Object.prototype.entries = function(){
	return Object.entries(this);
};

Object.prototype.values = function(){
	return Object.values(this);
};

Object.prototype.keys = function(){
	return Object.keys(this);
};

Array.prototype.collect = function(fn,p){
	this.forEach(c=>fn(p,c));
	return p;
};

Array.prototype.inflate = function(field,base={}){
	this.forEach(c=>base[c[field]]=c);
	return base;
};

Array.prototype.toBuckets = function(field,base={}){
	this.forEach(c=>(base[c[field]]||(base[c[field]]=[])).push(c));
	return base;
};

Array.prototype.concatSelf = function(){
	return this.reduce((p,c)=>p.concat(c),[]);
};

Array.prototype.mapDup = function(fn){
	return (this.length>0)?[this,this.map(fn)]:[];
};

Function.isNot = function(...options){
	return v=>options.indexOf(v)===-1;
};