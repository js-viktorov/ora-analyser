class TablesPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {highlighted:{}};
	}
  	render() {
    	return (<div id="wrapper">
					{this.props.tables.values().map(t=>{
						var highlightedColumn = (this.state.highlighted.table==t.TABLE_NAME)?this.state.highlighted.column:'';
						return <TableComponent table={t} highlightedColumn={highlightedColumn} highlight={(t,c)=>this.setState({highlighted:{table:t,column:c}})}/>;
					})}
				</div>);
  	}
  	componentWillUpdate(nextProps,nextState){
  		if(nextState.highlighted.keys().length>0){
			this.timeoutId = setTimeout(()=>this.setState({highlighted:{}}),0);
			this.componentWillUnmount = ()=>{
				log('clear');
				clearTimeout(this.timeoutId);
			};
  		}
  	}
}

class TableComponent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			fields : false,
			columns : false,
			ddl : false
		};
		this.toggleShown = this.toggleShown.bind(this);
	}
	toggleShown(property){
		this.setState({[property]:!this.state[property]})
	}
	componentWillUpdate(nextProps,nextState){
		if(nextProps.highlightedColumn && !nextState.columns){
			this.setState({columns:true});
		}
	}
	render() {
		var t = this.props.table;
		return (<div>
					<TableName name={t.TABLE_NAME} toggleShown={this.toggleShown} shown={this.state.entries()}/>
					<TableFields table={t} shown={this.state.fields}/>
					<TableColumns table={t} shown={this.state.columns} columns={this.props.table.data.columns} highlight={this.props.highlight} highlightedColumn={this.props.highlightedColumn}/>
					<TableDDL ddl={t.DDL_SCRIPT} shown={this.state.ddl}/>
				</div>);
	}
}

class TableName extends React.Component{
	render() {
		return (<div class="table-name">
					{this.props.shown.map(([k,v])=><Toggler class='icon' active={v} onClick={this.props.toggleShown.bind(null,k)} title={k} content={k[0].toUpperCase()}/>)}
					{' '}
					<span>{this.props.name}</span>
				</div>);
	}
}

class TableFields extends React.Component{
	render(){
		return (<table class={'default-table details-wrapper-shown-'+this.props.shown}>
					{((this.props.shown)?this.props.table.keys().filter(Function.isNot('TABLE_NAME','DDL_SCRIPT','data')):[])
							.mapDup(k=>this.props.table[k]).map(r=><TableRow row={r}/>)}
				</table>);
	}
}


class TableColumns extends React.Component{
	render(){
		return (<table class={'default-table details-wrapper-shown-'+this.props.shown}>
					{(this.props.shown?[this.props.columns[0],...this.props.columns]:[])
								.map((c,i)=>(i===0) ? c.keys().filter(Function.isNot('TABLE_NAME','OWNER','DATA_TYPE_MOD','DATA_TYPE_OWNER')) : c)
								.map((c,i,a)=>{
									if(i===0) {
										return <TableRow row={c}/>;
									}else{
										var highlight = c['COLUMN_NAME']==this.props.highlightedColumn;
										return <tr class={highlight?'lit':'ease dim'} ref={e=>this.storeRef(highlight,e)}>{a[0].map(k=>(k==='FOREIGN_KEY'&&c[k])
															? <td onClick={()=>this.props.highlight(...c[k].split('/'))}>{c[k]}</td>
															: <td>{c[k]}</td>)}</tr>;
									}
								})
					}
				</table>);
	}
	storeRef(highlight,ref){
		if(highlight && ref){
			this.rowRef = ref;
		}
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps.highlightedColumn && !this.props.highlightedColumn && this.rowRef){
			window.scrollTo(0, Math.max(this.rowRef.getBoundingClientRect().top + window.pageYOffset  - (window.innerHeight / 2),0));
		}
	}
}

class TableDDL extends React.Component{
	render(){
		return <div class={'ddl-wrapper details-wrapper-shown-'+this.props.shown}>{(this.props.shown)?<div>{this.props.ddl}</div>:''}</div>;
	}
}

function mountApp(settings){
	ReactDOM.render(
	  <TablesPage {...settings}/>,
	  document.getElementById('container')
	);
}