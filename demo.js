var store = {
	save( key, value ){
		localStorage.setItem( key, JSON.stringify(value) );
	},
	fetch( key ){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var todolist = store.fetch('lists');
var data = {
	list: todolist,
	todotext: '',
	edtortodos: '',
	beforetodos: '',
	visible: "all"
};
var vm = new Vue({
	el: '.content',
	data: data,
	watch: {
		list: {
			handler: function(){
				store.save( 'lists', this.list );
			},
			deep: true
		}
	},
	methods:{
		addTodo: function(){
			var reg = /^\s*$/g;
			if( this.todotext.length > 0 && this.todotext !== null && !reg.test(this.todotext) ){
				todolist.push( {
					title: this.todotext,
					isChecked: false
				} );
				this.todotext = '';   
			}
		},
		deletetodo: function( item ){
			todolist.splice( todolist.indexOf(item), 1 );
		},
		edtortodo:function( item ){
			this.beforetodos = item.title
			this.edtortodos = item;
		},
		edtorTodoed: function(){
			this.edtortodos = '';
		},
		canceltodo: function( item ){
			item.title = this.beforetodos;
			this.edtortodos = '';
			this.beforetodos = ''
		}
	},
	computed:{
		nocomplate: function(){
			return this.list.filter(function(item){
				return !item.isChecked;
			}).length;
		},

		fliterChange: function(){
			var filter = {
				all:function( todolist ){
					return todolist;
				},
				finished:function( todolist ){
					return todolist.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function( todolist ){
					return todolist.filter(function(item){
						return !item.isChecked;
					})
				}
			}

			return filter[this.visible](todolist);
		}
	},
	
	
	directives:{
		focus: {
			update:function(el, binding){
				if( binding.value ){
					el.focus();
				}
			}
		}
	}
})

function hashChange(){
	var hash = window.location.hash.slice(1) || 'all';
	vm.visible = hash;
}	
hashChange();
window.addEventListener('hashchange', hashChange);