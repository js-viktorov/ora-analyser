class TableRow extends React.Component{
	render(){
		return <tr>{this.props.row.map(v=><td>{v}</td>)}</tr>;
	}
}

class Toggler extends React.Component{
	render(){
		return <div onClick={this.props.onClick} class={this.props.class + ' ' + (this.props.active?'active':'')} title={this.props.title}>{this.props.content}</div>
	}
}