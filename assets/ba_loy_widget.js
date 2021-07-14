
(function(){

	var _renderer=(function(){
		function _rpoints(node){
			var rpoints={};
			if(node.constructor===Array){
				node.forEach(function(el){
					var temp=_rpoints(el);
					for(var i in temp) rpoints[i]=temp[i];
				});
				return rpoints;
			}

			var arr=[node];
			var temp=node.querySelectorAll('[data-rpoint]');
			for(var i=0;i<temp.length;i++) arr.push(temp[i]);

			arr.forEach(function(el){
				rpoints[el.dataset.rpoint]=el;
				delete el.dataset.rpoint;
			});
			return rpoints;
		}

		function _str2html(str){
			var container=document.createElement('div');
			container.innerHTML=str;
			var children=[];
			for(var i=0;i<container.childNodes.length;i++) children.push(container.childNodes[i]);
			if(children.length===1) return children[0];
			return children;
		}

		function _trim(str){
			return str.trim().replace(/\n|\t/g,'');
		}

		function _render(str){
			var node=_str2html(_trim(str));
			var rpoints=_rpoints(node);
			return {node:node,rpoints:rpoints};
		}

		function _template(str,args){
			return str.replace(/\{\{([\w\d\.]*)\}\}/g,function(full,name){
				if(args[name]) return args[name];
				return full;
			});
		}

		function _number_format(number, plus){
			var i=0;
			var str='';
			Math.abs(number).toString().split('').reverse().forEach(function(n){
				if(i==3){
					str=','+str;
					i=0;
				}
				str=n+str;
				i++;
			});

			if(number<0){
				str='-&nbsp;'+str;
			} else if(plus){
				str='+&nbsp;'+str;
			}

			return str;
		}

		function _date_format(date){
			var d=(new Date(date)).toDateString().split(' ');

			d[2]=d[2].toString();
			if(d[2].length===1) d[2]='0'+d[2];

			return d[1]+' '+d[2]+', '+d[3];
		}

		return {_render:_render, _template:_template, _number_format:_number_format, _date_format:_date_format};
	})();

	var _render_template = _renderer._render;
	var _template = _renderer._template;
	var _number_format = _renderer._number_format;
	var _date_format = _renderer._date_format;


	var placeholder_image = "https://cdn.shopify.com/s/files/1/0251/4311/5829/t/3/assets/placeholder.svg?v=17105015619549299227";
	var shippingIcon	 		= '<svg class="li-img" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M5 11v1h8v-7h-10v-1c0-.552.448-1 1-1h10c.552 0 1 .448 1 1v2h4.667c1.117 0 1.6.576 1.936 1.107.594.94 1.536 2.432 2.109 3.378.188.312.288.67.288 1.035v4.48c0 1.089-.743 2-2 2h-1c0 1.656-1.344 3-3 3s-3-1.344-3-3h-4c0 1.656-1.344 3-3 3s-3-1.344-3-3h-1c-.552 0-1-.448-1-1v-6h-2v-2h7v2h-3zm3 5.8c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm10 0c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm-3-2.8h-10v2h.765c.549-.614 1.347-1 2.235-1 .888 0 1.686.386 2.235 1h5.53c.549-.614 1.347-1 2.235-1 .888 0 1.686.386 2.235 1h1.765v-4.575l-1.711-2.929c-.179-.307-.508-.496-.863-.496h-4.426v6zm1-5v3h5l-1.427-2.496c-.178-.312-.509-.504-.868-.504h-2.705zm-16-3h8v2h-8v-2z"/></svg>';
	var giftIcon	 				= '<svg class="li-img" width="20" height="20" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11 24h-9v-12h9v12zm0-18h-11v4h11v-4zm2 18h9v-12h-9v12zm0-18v4h11v-4h-11zm4.369-6c-2.947 0-4.671 3.477-5.369 5h5.345c3.493 0 3.53-5 .024-5zm-.796 3.621h-2.043c.739-1.121 1.439-1.966 2.342-1.966 1.172 0 1.228 1.966-.299 1.966zm-9.918 1.379h5.345c-.698-1.523-2.422-5-5.369-5-3.506 0-3.469 5 .024 5zm.473-3.345c.903 0 1.603.845 2.342 1.966h-2.043c-1.527 0-1.471-1.966-.299-1.966z"/></svg>';
	var heartIcon	 				= '<svg class="li-img" width="20" height="20" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 10c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-6.527 4.593c-1.108 1.086-2.275 2.219-3.473 3.407-6.43-6.381-12-11.147-12-15.808 0-4.005 3.098-6.192 6.281-6.192 2.197 0 4.434 1.042 5.719 3.248 1.279-2.195 3.521-3.238 5.726-3.238 3.177 0 6.274 2.171 6.274 6.182 0 .746-.156 1.496-.423 2.253-.527-.427-1.124-.768-1.769-1.014.122-.425.192-.839.192-1.239 0-2.873-2.216-4.182-4.274-4.182-3.257 0-4.976 3.475-5.726 5.021-.747-1.54-2.484-5.03-5.72-5.031-2.315-.001-4.28 1.516-4.28 4.192 0 3.442 4.742 7.85 10 13l2.109-2.064c.376.557.839 1.048 1.364 1.465z"/></svg>';
	var cashIcon	 				= '<svg class="li-img" width="20" height="20" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M12.164 7.165c-1.15.191-1.702 1.233-1.231 2.328.498 1.155 1.921 1.895 3.094 1.603 1.039-.257 1.519-1.252 1.069-2.295-.471-1.095-1.784-1.827-2.932-1.636zm1.484 2.998l.104.229-.219.045-.097-.219c-.226.041-.482.035-.719-.027l-.065-.387c.195.03.438.058.623.02l.125-.041c.221-.109.152-.387-.176-.453-.245-.054-.893-.014-1.135-.552-.136-.304-.035-.621.356-.766l-.108-.239.217-.045.104.229c.159-.026.345-.036.563-.017l.087.383c-.17-.021-.353-.041-.512-.008l-.06.016c-.309.082-.21.375.064.446.453.105.994.139 1.208.612.173.385-.028.648-.36.774zm10.312 1.057l-3.766-8.22c-6.178 4.004-13.007-.318-17.951 4.454l3.765 8.22c5.298-4.492 12.519-.238 17.952-4.454zm-2.803-1.852c-.375.521-.653 1.117-.819 1.741-3.593 1.094-7.891-.201-12.018 1.241-.667-.354-1.503-.576-2.189-.556l-1.135-2.487c.432-.525.772-1.325.918-2.094 3.399-1.226 7.652.155 12.198-1.401.521.346 1.13.597 1.73.721l1.315 2.835zm2.843 5.642c-6.857 3.941-12.399-1.424-19.5 5.99l-4.5-9.97 1.402-1.463 3.807 8.406-.002.007c7.445-5.595 11.195-1.176 18.109-4.563.294.648.565 1.332.684 1.593z"/></svg>';
	var userIcon	 				= '<svg class="li-img" width="20" height="20" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg>';
	var orderIcon	 				= '<svg class="li-img" width="20" height="20" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.975 8l.025-.5c0-.517-.066-1.018-.181-1.5h5.993l-.564 2h-5.273zm-2.475 10c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm11.305-15l-3.432 12h-10.428l-.455-1.083c-.324.049-.652.083-.99.083-.407 0-.805-.042-1.191-.114l1.306 3.114h13.239l3.474-12h1.929l.743-2h-4.195zm-6.305 15c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm-9-15c-2.486 0-4.5 2.015-4.5 4.5s2.014 4.5 4.5 4.5c2.484 0 4.5-2.015 4.5-4.5s-2.016-4.5-4.5-4.5zm-.469 6.484l-1.687-1.636.695-.697.992.94 2.115-2.169.697.696-2.812 2.866z"/></svg>';

	var translations = {
		acct_creation_btn: window.top.BoosterApps.loy_config.brand_panel_settings.acct_creation_btn || "Join now",
		acct_creation_desc: window.top.BoosterApps.loy_config.brand_panel_settings.acct_creation_desc || "With more ways to unlock exciting perks, this is your all access pass to exclusive rewards!",
		visitor_point_desc: window.top.BoosterApps.loy_config.brand_panel_settings.visitor_point_desc || "Earn more Points for different actions, and turn those Points into awesome rewards!",
		acct_creation_title: window.top.BoosterApps.loy_config.brand_panel_settings.acct_creation_title || "Become a member",
		member_header_title: window.top.BoosterApps.loy_config.brand_panel_settings.member_header_title || "{points}",
		visitor_header_title: window.top.BoosterApps.loy_config.brand_panel_settings.visitor_header_title || "Rewards Program",
		visitor_point_header: window.top.BoosterApps.loy_config.brand_panel_settings.visitor_point_header || "Points",
		acct_creation_sign_in: window.top.BoosterApps.loy_config.brand_panel_settings.acct_creation_sign_in || "Already have an account?",
		member_header_caption: window.top.BoosterApps.loy_config.brand_panel_settings.member_header_caption || "Your points",
		visitor_header_caption: window.top.BoosterApps.loy_config.brand_panel_settings.visitor_header_caption || "",
		general_ways_to_earn: window.top.BoosterApps.loy_config.brand_panel_settings.general_ways_to_earn || "Ways to earn",
		general_ways_to_redeem: window.top.BoosterApps.loy_config.brand_panel_settings.general_ways_to_redeem || "Ways to redeem",
		general_sign_in: window.top.BoosterApps.loy_config.brand_panel_settings.general_sign_in || "Sign in",
		general_sign_up: window.top.BoosterApps.loy_config.brand_panel_settings.general_sign_up || "Sign up",
		general_no_rewards_yet: window.top.BoosterApps.loy_config.brand_panel_settings.general_no_rewards_yet || "No rewards yet",
		general_your_rewards_will_show_here: window.top.BoosterApps.loy_config.brand_panel_settings.general_your_rewards_will_show_here || "Your rewards will show here.",
		general_past_rewards: window.top.BoosterApps.loy_config.brand_panel_settings.general_past_rewards || "Past rewards",
		general_go_back: window.top.BoosterApps.loy_config.brand_panel_settings.general_go_back || "Go back",
		general_your_rewards: window.top.BoosterApps.loy_config.brand_panel_settings.general_your_rewards || "Your rewards",
		general_upcoming_reward: window.top.BoosterApps.loy_config.brand_panel_settings.general_upcoming_reward || "Upcoming reward",
		general_rewards: window.top.BoosterApps.loy_config.brand_panel_settings.general_rewards || "Rewards",
		general_redeem: window.top.BoosterApps.loy_config.brand_panel_settings.general_redeem || "Redeem",
		general_you_have: window.top.BoosterApps.loy_config.brand_panel_settings.general_you_have || "You have",
		general_reward: window.top.BoosterApps.loy_config.brand_panel_settings.general_reward || "reward",
		general_use_discount_code: window.top.BoosterApps.loy_config.brand_panel_settings.general_use_discount_code || "Use this discount code on your next order!",
		general_apply_code: window.top.BoosterApps.loy_config.brand_panel_settings.general_apply_code || "Apply code",
		general_add_product_to_cart: window.top.BoosterApps.loy_config.brand_panel_settings.general_add_product_to_cart || "Add product to cart",
		general_spent: window.top.BoosterApps.loy_config.brand_panel_settings.general_spent || "Spent",
		general_points: window.top.BoosterApps.loy_config.brand_panel_settings.general_points || "Points",
		general_point: window.top.BoosterApps.loy_config.brand_panel_settings.general_point || "Point",
		general_no_points_yet: window.top.BoosterApps.loy_config.brand_panel_settings.general_no_points_yet || "No Points yet",
		general_have_not_earned_points: window.top.BoosterApps.loy_config.brand_panel_settings.general_have_not_earned_points || "You haven't earned any Points yet.",
		general_how_to_earn_points: window.top.BoosterApps.loy_config.brand_panel_settings.general_how_to_earn_points || "How do I earn Points?",
		general_points_activity: window.top.BoosterApps.loy_config.brand_panel_settings.general_points_activity || "Points activity",
		general_place_an_order: window.top.BoosterApps.loy_config.brand_panel_settings.general_place_an_order || "Place an order",
		general_points_for_every: window.top.BoosterApps.loy_config.brand_panel_settings.general_points_for_every || "Points for every",
		general_celebrate_birthday: window.top.BoosterApps.loy_config.brand_panel_settings.general_celebrate_birthday || "Celebrate a birthday",
		general_celebrate_your_birthday: window.top.BoosterApps.loy_config.brand_panel_settings.general_celebrate_your_birthday || "Celebrate your birthday",
		general_birthday_reward: window.top.BoosterApps.loy_config.brand_panel_settings.general_birthday_reward || "Birthday reward",
		general_edit_date: window.top.BoosterApps.loy_config.brand_panel_settings.general_edit_date || "Edit date",
		general_month: window.top.BoosterApps.loy_config.brand_panel_settings.general_month || "Month",
		general_day: window.top.BoosterApps.loy_config.brand_panel_settings.general_day || "Day",
		general_enter_valid_date: window.top.BoosterApps.loy_config.brand_panel_settings.general_enter_valid_date || "Please enter a valid date",
		general_save_date: window.top.BoosterApps.loy_config.brand_panel_settings.general_save_date || "Save date",
	}

	function formattedPrice(price) {
      if (typeof price == "undefined" || price == null){return ""}
      if (typeof price == "string" && price.length == 0){return ""}

      var format = window.top.BoosterApps.common.shop.money_format;
      var moneyRegex = /\{\{\s*(\w+)\s*\}\}/;
      function defOpt(opt,def){return typeof opt == "undefined" ? def : opt}

      function displayDelims(n,p,t,d){
        p = defOpt(p, 2);
        t = defOpt(t, ",");
        d = defOpt(d, ".");
        if (isNaN(n) || n == null){
          return 0;
        }
        n = n.toFixed(p);
        var parts = n.split("."),dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t),price = parts[1] ? d + parts[1] : "";
        return dollars + price
      }

      var val = "";
			//todo switch back to decimals
      switch (format.match(moneyRegex)[1]) {
        case "amount":
          val = displayDelims(price, 0);
          break;
        case "amount_no_decimals":
          val = displayDelims(price, 0);
          break;
        case "amount_no_decimals_with_comma_separator":
          val = displayDelims(price, 0, ".", ",");
          break
        case "amount_with_comma_separator":
          val = displayDelims(price, 0, ".", ",");
          break;
      }
      return format.replace(moneyRegex, val)
    }

	//Clicks, psl_actions
	var psl_actions=(function(){
		var _list={};

		function _add(uid,callback){
			if(typeof(uid)==='object'){
				for(var i in uid) _add(i, uid[i]);
				return;
			}
			_list[uid]=callback;
		}

		function _remove(uid){
			if(typeof(uid)!=='string'){
				if(uid instanceof Object){
					for(var i in uid) _remove(i);
					return;
				} else if(uid instanceof Array){
					uid.forEach(_remove);
					return;
				}
			}
			delete _list[uid];
		}

		function _handler(e){
			var el=e.target;
			while(el&&el.dataset&&!el.dataset.action) el=el.parentNode;
			if(!el) return;
			if(!el.dataset||!el.dataset.action) return;
			if(!_list[el.dataset.action]) return;
			e.stopPropagation();
			e.preventDefault();
			var args=el.dataset.data;
			if(args){
				args=args.split(',').map(function(el){
					try{
						return JSON.parse(el);
					} catch(e){
						return el;
					}
				});
			} else {
				args=[];
			}
			args.unshift(e);

			_list[el.dataset.action].apply(undefined,args);
			return false;
		}

		function _fire(action, e){
			if(action instanceof HTMLElement) return action.click();
			if(!_list[action]) return;
			var args=[];
			for(var i=2; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
			args.unshift(e);
			_list[action].apply(undefined,args);
		}

		window.addEventListener('click',_handler);

		var _ext={
			add:_add,
			remove:_remove,
			fire:_fire,
		};

		return _ext;
	})();

	var psl_events=(function(){

		var _evt_list={};

		var _ext={
			on:function(name, clb){
				if(typeof(name)==='object'){
					for(var i in name) _ext.on(i,name[i]);
					return;
				}
				if(_ext._has_clb(name,clb)) return;
				if(!_evt_list[name]) _evt_list[name]=[];
				_evt_list[name].push(clb);
			},
			_has_clb:function(name,clb){
				if(!_evt_list[name]) return false;
				return _evt_list[name].indexOf(clb)!==-1;
			},
			once:function(name,clb){
				if(typeof(name)==='object'){
					for(var i in name) _ext.once(i,name[i]);
					return;
				}
				clb.once=true;
				_ext.on(name,clb);
			},
			emit:function(name,args){
				if(!args) args=[];
				if(!_evt_list[name]) return;
				_evt_list[name].forEach(function(clb){
					clb.apply(undefined,args);
					if(clb.once) _ext.remove(name,clb);
				});
			},
			remove:function(name,clb){
				if(typeof(name)==='object'){
					for(var i in name) _ext.remove(i,name[i]);
					return;
				}
				if(!_evt_list[name]) return;
				var index=_evt_list[name].indexOf(clb);
				if(index===-1) return;
				_evt_list[name].splice(index,1);
			}
		}

		return _ext;
	})();

	var _iframe=(function(){
		window.addEventListener('message',function(e){
			switch(e.data.msg_action){
				case 'event.opened':
					psl_events.emit('window.opened');
				break;
				case 'app.started':
					var deepLinkPage = window.top.BoosterApps.deepLinks['page'];
					if (_storage.customer && deepLinkPage) {
						psl_actions.fire('app.page.toggle', e, deepLinkPage);
						if (deepLinkPage == 'reward_page' && window.top.BoosterApps.deepLinks['reward_id']) {
								psl_actions.fire('app.redeem.show', null, parseInt(window.top.BoosterApps.deepLinks['reward_id']));
						}
					}
				break;
				case 'app.redeem.product-options':
					psl_actions.fire('app.redeem.product-options', e.data.msg_options);
				break;
				default:
					console.log('unimplemented cmd', e);
				break;
			}
		});

		return function(msg,opts){
			window.top.postMessage({msg_action: msg, msg_options: opts}, '*');
		};
	})();

	var _API=(function(){

		var URL= window.top.BoosterApps.loy_config.api_endpoint;

		var _POST_METHODS=['update_dob','redeem'];

		function _request(api_call,params){
			if(!params) params={};
			var method=(_POST_METHODS.indexOf(api_call)!==-1)?'POST':'GET';
			var url=URL+'/'+api_call+(method==='GET'?'.json':'');
			var data={
				method:method,
				headers: {
					'Content-Type': 'application/json'
				},
			};
			switch(method){
				case 'GET':
					var query=[];
					for(var i in params) query.push(i+'='+params[i]);
					if(query.length) url+='?'+query.join('&');
				break;
				case 'POST':
					var body={};
					for(var i in params) body[i]=params[i];
					data.body=JSON.stringify(body);
				break;
			}

			return new Promise(function(resolve,reject){
				fetch(url,data).then(function(response){
					if(response.status!==200){
						console.error('API response status is '+response.status);
						return resolve({});
					}
					response.json().then(resolve);
				}).catch(function(e){
					console.error(e);
					resolve({});
				});
			});
		}

		return {
			rewards:function(){
				return  _request('rewards').then(function(resp){
					var data=resp.rewards;
					if(!data) data=[];
					data=data.filter(function(el){return el.enabled});
					psl_events.emit('api.call.rewards',[data]);
					return data;
				});
			},
			identify_customer:function(customer_id){
				if(!customer_id) return Promise.resolve();
				return _request('identify_customer',{customer_id:customer_id}).then(function(resp){
					return resp.customer;
				});
			},
			update_dob:function(customer_id,dob){
				if(!customer_id || !dob) return Promise.resolve();
				return _request('update_dob',{customer_id:customer_id,dob:dob}).then(function(resp){
					if(resp&&resp.success==='true') return true;
					return false;
				});
			},
			points_logs:function(customer_id, page){
				var def_data={points_logs:[],metadata:{prev_page:null,next_page:null}};
				if(!customer_id) return Promise.resolve(def_data);
				var r_data={customer_id:customer_id};
				if(page) r_data.page=page;
				return _request('points_logs',r_data).then(function(data){
					if(!data) data=def_data;
					psl_events.emit('api.call.points_logs',[data]);
					return data;
				});
			},
			best_reward_to_show:function(customer_id){
				if(!customer_id) return Promise.resolve();
				return _request('best_reward_to_show',{customer_id:customer_id}).then(function(resp){
					return resp.reward;
				});
			},
			points_purchases:function(customer_id, used, page){
				var def_data={points_purchases:[],metadata:{prev_page:null,next_page:null}};
				if(!customer_id) return Promise.resolve(def_data);
				var r_data={customer_id:customer_id, used:used||false};
				if(page) r_data.page=page;
				return _request('points_purchases',r_data).then(function(data){
					if(!data) data=def_data;
					psl_events.emit('api.call.points_purchases',[data]);
					return data;
				});
			},
			redeem:function(customer_id,reward_name){
				if(!customer_id || !reward_name) return Promise.resolve();
				return _request('redeem',{customer_id:customer_id,reward_name:reward_name}).then(function(resp){
					if(resp&&resp.success==='true') return resp.points_purchase;
				});
			},
		};
	})();

	var _storage=(function(){

		var _ext={
			money_format:(window.top.BoosterApps.common.shop.money_format)||'{{amount_with_comma_separator}}$',
			ways_to_earn: window.top.BoosterApps.loy_config.ways_to_earn,
		};

		psl_events.on({
			'app.init':function(){
				Promise.all([
					_API.identify_customer(window.customer?window.customer.id:undefined).then(function(data){
						_ext.customer=data;
					}),
					_API.best_reward_to_show(window.customer?window.customer.id:undefined).then(function(data){
						_ext.best_reward=data;
					}),
					new Promise(function(resolve){
						_ext.points_purchases=[];

						function next(page){
							_API.points_purchases(window.customer?window.customer.id:undefined, false, page).then(function(data){
								data.points_purchases.forEach(function(el){_ext.points_purchases.push(el)});
								if(data.metadata.next_page){
									next(data.metadata.next_page);
								} else {
									resolve();
								}
							});
						}

						next(0);
					})
				]).then(function(){
					psl_events.emit('storage.ready');
				});
			}
		});

		return _ext;
	})();

	var Page=(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		function _hide(){
			_view.style.display='none';
		}

		function _show(){
			return _render().then(function(){
				_view.style.display='';
			});
		}

		function _render(){
			return Promise.resolve();
		}

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){return _footer;},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})();

	var app=(function(){
		var rendered=_render_template('<div class="other-window-body">\n<div class="section-wrapper ba-loy-banner ba-loy-collapsed-banner no-outline">\n<div class="central-body-wrapper">\n<div class="section-top-wrapper open-top-panel small-notice" tabindex="-1" data-rpoint="header"></div>\n<div class="panel-section ba-loy-footer" data-rpoint="container"></div>\n<div class="section-bottom" data-rpoint="footer"></div>\n</div>\n</div>\n</div>');

		var node=rendered.node;
		var rpoints=rendered.rpoints;

		psl_events.on({
			'app.init': function(){
				document.body.id='baLoySectionWrapper';
				document.body.className='section-content';
			},
			'window.opened':function(){
				//TODO request user's data again.
			},
			'storage.ready':function(){
				document.body.innerHTML='';
				document.body.appendChild(node);
				_current_page.show();
				window.postMessage({msg_action: 'app.started'});
			},
		});

		var _history=['index'];

		function _toggle_page(old_page,new_page){
			if(!old_page) old_page=_current_page;
			if(old_page) old_page.hide();
			_current_page=new_page;
			_current_page.show();
			_history.push(new_page.id);
			psl_events.emit('app.page.change',[old_page,_current_page]);
		}

		psl_actions.add({
			'app.page.toggle':function(e,id){
				_toggle_page(_current_page,_pages[id]);
			},
			'app.page.toggle_back':function(){
				_history.pop();
				_toggle_page(_current_page,_pages[_history.pop()]);
			},
			'app.call':function(e,action){
				_iframe('widget.'+action);
			}
		});

		(function(){
			var c=rpoints.container;
			c.addEventListener('scroll',function(e){
				psl_events.emit('app.container.scroll',[{bottom:(c.offsetHeight+c.scrollTop)/c.scrollHeight}]);
			});
		})();

		var _pages={};

		var _ext={
			add_page:function(id,page_controller){
				_pages[id]=page_controller;
				page_controller.id=id;
				rpoints.container.appendChild(page_controller.view);
			},
			toggle_page:_toggle_page
		};

		var _header=(function(view){
			var rendered=_render_template('<div class="section-top-bar">\n<div class="alc head-container">\n<button class="arrow-loy-button section-back-img" aria-label="Back" data-action="app.page.toggle_back" data-rpoint="back"></button>\n<div>\n<div class="truncate" data-rpoint="collapsed_line2">' + translations.visitor_header_title + '</div>\n<div class="para"></div>\n</div>\n</div>\n<button class="loy-close-widget" aria-label="Close" data-action="app.call" data-data="close"></button>\n</div>\n<div class="section-open-top-panel ba-loy-bg-color">\n<div class="header-content">\n<div class="back-img"></div>\n<div class="header-main truncate" data-rpoint="expanded_line1">' + translations.visitor_header_title + '</div>\n<div class="header-secondary head-title truncate" data-rpoint="expanded_line2">' + translations.visitor_header_caption + '</div>\n</div>\n</div>');
			rendered.node.forEach(function(el){view.appendChild(el)});
			var _rpoints=rendered.rpoints;

			var state='expanded';

			psl_events.on({
				'storage.ready':_render,
				'app.page.change':function(old_page,new_page){
					_state(new_page.header()||"expanded");
				},
				'app.points.change':_render,
			});

			function _state(v){
				if(!v) return state;
				state=v;
				var cls;
				switch(state){
					case 'expanded':
						cls='section-top-wrapper open-top-panel small-notice';
					break;
					case 'collapsed':
						cls='section-top-wrapper collapsed small-notice';
					break;
				}
				view.className=cls;
			}

			_state('expanded');

			function _render(){
				if(_storage.customer){
					_rpoints.expanded_line1.innerHTML=translations.member_header_caption;
					_rpoints.expanded_line2.innerHTML=_number_format(_storage.customer.points_tally);
					_rpoints.collapsed_line2.innerHTML=_number_format(_storage.customer.points_tally)+ ' ' + translations.general_point + (_storage.customer.points_tally>1 && translations.general_point =='Point'?'s':'');
				} else {
// 					_rpoints.expanded_line1.innerHTML=_storage.header.line1;
// 					_rpoints.expanded_line2.innerHTML=_storage.header.line2;
// 					_rpoints.collapsed_line2.innerHTML=_storage.header.line2;
				}
			}
		})(rpoints.header);

		var _footer=(function(view){

			var state='';

			psl_events.on('app.page.change',function(old_page,new_page){
				_state(new_page.footer()||"default");
			});

			var _states={
				default:'<div class="pwrd">\n<div class="">Powered by Booster Apps</div\n</div>',
				login:'<div>\n<a class="loy-button loy-button-main member-signup-footer-loy-button" href="#" data-action="app.call" data-data="register">' + translations.acct_creation_btn + '</a>\n<div class="account-login">' + translations.acct_creation_sign_in + '&nbsp;<a href="#" data-action="app.call" data-data="login" class="sign-in">' + translations.general_sign_in + '</a></div>\n</div>'
			};

			function _state(v){
				if(!v) return state;
				state=v;
				view.innerHTML=_states[v];
			}

			_state('default');
		})(rpoints.footer);

		var _current_page=(function(){
			var _view=document.createElement('div');
			var _header='expanded';
			var _footer='default';

			function _hide(){
				_view.style.display='none';
			}

			function _show(){
				return _render().then(function(){
					_view.style.display='';
				});
			}

			function _render(){
				_view.innerHTML=_render_your_rewards()+'\n<div class="section-panel-wrapper ">\n'+_render_points()+'\n<div class="section-table-wrapper ">\n'+_render_earn_section()+'\n'+_render_redeem_section()+'\n</div>\n</div>\n</div>';
				return Promise.resolve();
			}

			function _render_points(){
				if(_storage.customer) return '<div class="home-points-section home-points-section-injected">\n<div class="ajax-interceptor hide-ajax-spin ajax-loader-cover "></div>\n<div class="panel-top-wrapper" style="display:none;">\n<div class=" panel-title">'+_number_format(_storage.customer.points_tally)+' ' + translations.general_point+(_storage.customer.points_tally>1 && translations.general_point == 'Point'?'':'s')+'</div>\n<button class="browser-loy-button history logs-loy-button" aria-label="Points history" data-action="app.page.toggle" data-data="history"></button>\n</div>\n'+(_storage.best_reward?('\n<div class="next-reward-title less-color">' + translations.general_upcoming_reward + '</div>\n<div class="section-table-wrapper has-bottom-border">\n'+reward(_storage.best_reward)+'\n</div>'):"")+'\n</div>';

				return '<div>\n<div class="head-title center-align">' + translations.visitor_point_header + '</div>\n<div class="panel-desc center-align">' + translations.visitor_point_desc + '</div>\n</div>';
			}

			function _render_your_rewards(){
				if(_storage.customer) return '<div class="section-panel-wrapper">\n<div class="home-rewards-section">\n<div class="section-table-wrapper unborderable">\n<div class="section-table-piece-wrapper">\n<button class="section-table-piece-item " aria-label="Rewards" data-action="app.page.toggle" data-data="my_rewards">\n<div class="section-table-piece-item-content">\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title text-capitalize">' + translations.general_rewards + '</div>\n'+(_storage.points_purchases&&_storage.points_purchases.length>0?('<div class="section-table-piece-item-desc less-color">' + translations.general_you_have + ' ' + _storage.points_purchases.length + ' ' + translations.general_reward+(_storage.points_purchases.length>1 && translations.general_reward =='reward'?'s':'')+'</div>'):'')+'\n</div>\n</div>\n<div class="arrow right"></div>\n</button>\n</div>\n</div>\n</div>\n</div>';

				return '<div class="section-panel-wrapper member-signup-card-container">\n<div class="member-signup-card center-align">\n<div class="head-title">' + translations.acct_creation_title + '</div>\n<div class="panel-desc ">' + translations.acct_creation_desc + '</div>\n<a class="loy-button loy-button-main " href="#" data-action="app.call" data-data="register">' + translations.acct_creation_btn + '</a>\n<div class="main-default">' + translations.acct_creation_sign_in + '&nbsp;<a href="#" data-action="app.call" data-data="login" class="sign-in">' + translations.general_sign_in + '</a></div>\n</div>\n</div>';

			}

			function _render_earn_section(){
				return '<div class="section-table-piece-wrapper ">\n<button class="section-table-piece-item " aria-label="Ways to earn" data-action="app.page.toggle" data-data="ways_to_earn">\n<div class="section-table-piece-item-content">\n'+heartIcon+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">' + translations.general_ways_to_earn + '</div>\n</div>\n</div>\n<div class="arrow right"></div>\n</button>\n</div>';
			}

			function _render_redeem_section(){
				return '<div class="section-table-piece-wrapper ">\n<button class="section-table-piece-item " aria-label="Ways to redeem" data-action="app.page.toggle" data-data="ways_to_redeem">\n<div class="section-table-piece-item-content">\n'+giftIcon+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">' + translations.general_ways_to_redeem + '</div>\n</div>\n</div>\n<div class="arrow right"></div>\n</button>\n</div>';
			}

			_hide();

			var _ext={
				view:_view,
				header:function(){return _header;},
				footer:function(){return _footer;},
				show:_show,
				hide:_hide,
			}

			return _ext;
		})();

		_ext.add_page('index',_current_page);
		_current_page.show('left');
		return _ext;
	})();

	app.add_page('ways_to_earn',(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		function _hide(){
			_view.style.display='none';
		}

		function _show(){
			return _render().then(function(){
				_view.style.display='';
			});
		}

		function _render_item(el){

			var icon='';
			var header=''
			var desc=_number_format(el.points_amount)+' '+translations.general_points;
			var earned=false;
			var action='';

			switch(el.trigger){
				case 'order_placed':
					icon=orderIcon;
					header=translations.general_place_an_order;
					if (el.points_type == 'multiplier'){
						desc=_number_format(el.points_amount)+' '+ translations.general_points_for_every + ' ' + formattedPrice(1) + ' <span class="text-lowercase">'+ translations.general_spent + '</span>';
					}
				break;
				case 'loy_contact_birthday':
					icon=cashIcon;
					header=translations.general_celebrate_birthday;
					if(_storage.customer) action='<button class="loy-button loy-button-sm loy-button-main points-activity-rule-action-button" data-action="app.page.toggle" data-data="edit_dob">'+ translations.general_edit_date +'</button>';
				break;
				case 'loy_contact_member_enabled':
					icon=userIcon;
					header=translations.general_sign_up;
					if(_storage.customer) earned=true;
				break;
				default:
					debugger;
				break;
			}

			return '<div class="section-table-piece-wrapper">\n<div class="section-table-piece-item unhoverable'+(earned?' half-opacity':"")+'" aria-label="Signup">\n<div class="section-table-piece-item-content">\n'+icon+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+header+'</div>\n<div class="section-table-piece-item-desc less-color">'+desc+'</div>\n</div>\n</div>\n'+(earned?'<div class="tick"></div>':'')+'\n'+(action?action:'')+'\n</div>\n</div>';
		}

    function _render_ways_to_earn() {
    }

    function _render(){
      _view.innerHTML='<div class="section-deep-panel">\n<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_ways_to_earn + '</div>\n</div>\n<div class="section-table-wrapper">\n'+_storage.ways_to_earn.map(_render_item).join('')+'\n</div>\n</div>';
      return Promise.resolve();
    }

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){
				if(_storage.customer) return 'default';
				return 'login';
			},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());

	var reward=(function(){

		function _icon(type){
			switch(type){
				case 'fixed_amount':
				return cashIcon;
				break;
				case 'percentage':
					return cashIcon;
				break;
				case 'free_shipping':
					return shippingIcon;
				break;
				case 'free_product':
					return giftIcon;
				break;
				default:
					return cashIcon;
				break;
			}
		}

		function _render_item(el){
			var header=el.name;
			var desc=_number_format(el.points_amount)+' '+translations.general_points;
			var earned=false;
			var action='';


			if(_storage.customer){
				if(_storage.customer.points_tally>=el.points_amount){
					action='<button class="loy-button loy-button-sm loy-button-main prods-btn" data-action="app.redeem" data-data="'+el.id+'">' + translations.general_redeem + '</button>';
				} else {
					action='<span class="progress-bar">\n<div></div>\n</span>'
				}
			}

			return '<div class="section-table-piece-wrapper">\n<div class="section-table-piece-item unhoverable">\n<div class="section-table-piece-item-content">\n<div class="reward-img-wrapper">\n'+_icon(el.reward_type)+'\n</div>\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+header+'</div>\n<div class="section-table-piece-item-desc less-color">'+desc+'</div>\n</div>\n</div>\n'+(action?action:'')+'\n</div>\n</div>';
		}

		_render_item.get_icon=_icon;

		return _render_item;
	})();

	app.add_page('ways_to_redeem',(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		function _hide(){
			_view.style.display='none';
		}

		function _show(){
			return _render().then(function(){
				_view.style.display='';
			});
		}

    function _render_rewards() {
      _view.innerHTML='<div class="section-deep-panel">\n<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_ways_to_redeem + '</div>\n</div>\n<div class="section-table-wrapper">\n'+_storage.rewards.map(reward).join('')+'\n</div>\n</div>';
    }

    function _render(){
      if (_storage.rewards) {
        _render_rewards();
        return Promise.resolve();
      } else {
        _view.innerHTML = '<div class="spin-wrapper ajax-interceptor ajax-loader-exit" data-rpoint="loading"></div>\n<div class="section-deep-panel" data-rpoint="section"></div>';
        _view.style.display='';
        return _API.rewards()
          .then(function(data){
            _storage.rewards = data;
          })
          .then(function(data){
            _render_rewards();
          });
      }
    }

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){
				if(_storage.customer) return 'default';
				return 'login';
			},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());

	app.add_page('reward_page',(function(){

		psl_actions.add({
			"app.redeem":function(e,id){_redeem(id)},
			"app.redeem.show":function(e,id){
				var pp=_storage.points_purchases.filter(function(el){return el.id===id})[0];
				render(pp);
				app.toggle_page(undefined,_ext);
			},
			"app.redeem.copy":copy,
			"app.redeem.apply": function(e){
				_rpoints.button.classList.add('loy-button-loading');
				var payload = { code: _data.code };
				if (_data.reward.reward_type == 'free_product') {
					payload['product_id'] = _data.reward.properties.product_id;
					payload['variant_ids'] = _data.reward.properties.variant_ids;
				}
				_iframe('widget.apply_discount_code', payload);
				_rpoints.button.classList.add('loy-button-success');
				_rpoints.button.classList.remove('loy-button-loading');
			},
			"app.redeem.product-options": function(e) {
				_rpoints.product.href=e.url;
				_rpoints.message.style.display='';
			},
			"app.redeem.visit_product": function(e) {
				_iframe('widget.visit', {url: e.target.href});
			}
		});

		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		var rendered=_render_template('<div class="spin-wrapper ajax-interceptor ajax-loader-exit" data-rpoint="loading" style="display:none"></div>\n<div class="section-panel-wrapper reward-fulfillment-card" data-rpoint="ready">\n<div class="section-table-wrapper unhoverable unborderable">\n<div class="section-table-piece-wrapper ">\n<div class="section-table-piece-item">\n<div class="section-table-piece-item-content">\n<div data-rpoint="image_wrapper"></div>\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title" data-rpoint="title">$20 off coupon</div>\n<div class="section-table-piece-item-desc less-color">' + translations.general_spent + ' <span data-rpoint="spent"></span> ' + translations.general_points + '</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n<div class="panel-desc ">\n<span>' + translations.general_use_discount_code + '</span>\n</div>\n<div class="center-align">\n<div class="copy-coupon ">\n<input readonly="" class="coupon-code txt-field center-align full-width" type="text" tabindex="-1" value="" data-rpoint="code">\n<button class="browser-loy-button copy" aria-label="Copy coupon code" data-action="app.redeem.copy"></button>\n</div>\n<div class="txt-warning" style="display:none" data-rpoint="message">Please choose an option from the <a href="" data-rpoint="product" data-action="app.redeem.visit_product">product page</a>.</div>\n<button class="loy-button loy-button-sm loy-button-main full-width copy-loy-button" data-rpoint="button" data-action="app.redeem.apply">' + translations.general_apply_code + '</button>\n</div>\n</div>');
		var _rpoints=rendered.rpoints;
		rendered.node.forEach(function(el){_view.appendChild(el)});

		function _hide(){
			_view.style.display='none';
		}

		function _show(){
			return _render().then(function(){
				_rpoints.message.style.display='none';
				_view.style.display='';
			});
		}

		function _render(){
			return Promise.resolve();
		}

		var _data;

		function render(el){
			if (el.reward.reward_type === 'free_product') {
				_rpoints.button.innerHTML = translations.general_add_product_to_cart;
			} else {
				_rpoints.button.innerHTML = translations.general_apply_code;
			}
			_rpoints.loading.style.display='none';
			_rpoints.ready.style.display='';
			_rpoints.image_wrapper.innerHTML=reward.get_icon(el.reward?el.reward.reward_type:undefined);
			_rpoints.title.innerHTML=el.name;
			_rpoints.spent.innerHTML=_number_format(el.points_amount, false);
			_rpoints.code.value=el.code;
			_data=el;
		}

		function copy(){
			try{
				navigator.clipboard.writeText(_data.code);
			} catch (e){
				console.log(e);
			}
			_rpoints.code.focus();
			_rpoints.code.select();
		}

		function _redeem(id){
			_rpoints.loading.style.display='';
			_rpoints.ready.style.display='none';
			app.toggle_page(undefined,_ext);
			_API.redeem(_storage.customer.remote_id,id).then(function(data){
				if(data){
					//TODO
					_storage.points_purchases.unshift(data);
					render(data);
					_storage.customer.points_tally=data.cus_points_tally;
					psl_events.emit('app.points.change');
				} else {
					psl_actions.fire("app.page.toggle_back",{});
				}
			});
		}

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){return _footer;},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());

	app.add_page('edit_dob',(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		psl_actions.add('app.page.dob.save',function(e){
			save();
		});

		function _hide(){
			_view.style.display='none';
		}

		function _show(){
			return _render().then(function(){
				_view.style.display='';
			});
		}

		function _render(){
			var dob='';
			if(_storage.customer && _storage.customer.dob) dob=_storage.customer.dob.replace('/','');

			var i=0;
			_inputs_pass(function(){},function(el){
				el.value=dob?dob[i]:'';
				i++;
			});
			_rpoints.button.classList.remove('loy-button-success');
			return Promise.resolve();
		}

		_hide();

		var rendered=_render_template('<div class="section-deep-panel ">\n<div class="panel-top-wrapper">\n<div class="panel-title head-title ">'+ translations.general_birthday_reward +'</div>\n</div>\n<div class="section-table-wrapper unborderable unhoverable">\n<div class="section-table-piece-wrapper ">\n<div class="section-table-piece-item " aria-label="Celebrate a birthday">\n<div class="section-table-piece-item-content">\n'+cashIcon+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+translations.general_celebrate_birthday+'</div>\n<div class="section-table-piece-item-desc less-color"><span data-rpoint="points"></span> '+ translations.general_points +'</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n<div class="panel-desc celebrate-dob">'+ translations.general_celebrate_your_birthday +'</div>\n<div class="dob-container">\n<div class="birthday">\n<div class="groups ">\n<h4>'+ translations.general_month +'</h4>\n<h4>'+ translations.general_day +'</h4>\n</div>\n<div class="inputs">\n<input data-type="M" data-index="0" type="tel" maxlength="1" placeholder="M" class="txt-field one-input " value="" data-rpoint="input_m1">\n<input data-type="M" data-index="1" type="tel" maxlength="1" placeholder="M" class="txt-field one-input " value="" data-rpoint="input_m2">\n<input data-type="D" data-index="0" type="tel" maxlength="1" placeholder="D" class="txt-field one-input " value="" data-rpoint="input_d1">\n<input data-type="D" data-index="1" type="tel" maxlength="1" placeholder="D" class="txt-field one-input " value="" data-rpoint="input_d2">\n</div>\n</div>\n</div>\n<div class="center-align">\n<div class="error-text para error full-width" data-rpoint="error">'+ translations.general_enter_valid_date +' (MM-DD)</div>\n<button class="loy-button loy-button-sm loy-button-main" data-action="app.page.dob.save" data-rpoint="button">'+ translations.general_save_date +'</button>\n</div>\n</div>');
		_view.appendChild(rendered.node);
		_rpoints=rendered.rpoints;

		_inputs_pass(function(){},function(el,t,d){
			el.addEventListener('input',function(e){
				_error('');
				if(e.target.nextElementSibling){
					e.target.nextElementSibling.focus();
					e.target.nextElementSibling.select();
				} else {
					e.target.blur();
				}
			});
		});
		_error('');

    _rpoints.points.innerHTML=_number_format((_storage.ways_to_earn.filter(function(we){return we.trigger==='reward_dob_trigger'})[0]||{points_amount:0}).points_amount);

		var _DAYS=[ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		function _check_data(month,day){
			month=parseInt(month);
			day=parseInt(day);
			if(isNaN(month)) return false;
			if(isNaN(day)) return false;
			if(month<1||month>12) return false;
			if(day<0) return false;
			if(day>_DAYS[month-1]) return false;
			return true;
		};

		function _inputs_pass(gr,el){
			(['m','d']).forEach(function(t){
				([1,2]).forEach(function(d){
					el(_rpoints['input_'+t+d],t,d);
				});
				gr(t);
			});
		}

		function save(){
			var day='';
			var month='';
			var error=false;
			_inputs_pass(function(){},function(el,t){
				var v=el.value;
				if(!v) error=true;
				switch(t){
					case 'm':month+=v;break;
					case 'd':day+=v;break;
				}
			});
			if(error||(!_check_data(month,day))) return _error(translations.general_enter_valid_date +' (MM-DD)');
			var dob=month+'/'+day;
			_rpoints.button.classList.add('loy-button-loading');
			_API.update_dob(_storage.customer.remote_id, dob).then(function(result){
				if(result) _storage.customer.dob=dob;
				_rpoints.button.classList.add('loy-button-success');
				_rpoints.button.classList.remove('loy-button-loading');
				setTimeout(function(){psl_actions.fire('app.page.toggle_back',{})},500);
			});
		}

		function _error(e){
			_rpoints.error.innerHTML=e;
			_inputs_pass(function(){},function(el){el.classList[e?'add':'remove']('error')});
			_rpoints.error.style.display=e?'':'none';
		}

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){return _footer;},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());

	//Points logs
	app.add_page('history',(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		var rendered=_render_template('<div class="spin-wrapper ajax-interceptor ajax-loader-exit" data-rpoint="loading" style="display:none"></div>\n<div class="section-deep-panel" data-rpoint="section" style="display:none"></div>');

		var _templates={ //I'm not sure "empty" is possible, only if we don't have any rewards for sign up?
			'empty':_render_template('<div>\n<div class="section-table-wrapper center-align">\n<div class=""></div>\n<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_no_points_yet + '</div>\n</div>\n<div class="">' + translations.general_have_not_earned_points + '</div>\n<button class="loy-button-link-main" data-action="app.page.toggle" data-data="ways_to_earn">' + translations.general_how_to_earn_points + '</button>\n</div>\n</div>'),
			'logs':_render_template('<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_points_activity + '</div>\n</div>\n<div class="section-table-wrapper " data-rpoint="list">\n</div>')
		};
		var _rpoints=rendered.rpoints;
		rendered.node.forEach(function(el){_view.appendChild(el)});


		function _hide(){
			_view.style.display='none';
			psl_events.remove('app.container.scroll',_listener);
		}

		var _listener=function(data){
			if(data.bottom>0.9) _load_more();
		};

		function _show(){
			return _render().then(function(){
				_view.style.display='';
				psl_events.on('app.container.scroll',_listener);
			});
		}

		var _next_page;

		function _render(){
			_rpoints.loading.style.display='';
			return _API.points_logs(_storage.customer.remote_id).then(function(data){
				_next_page=data.metadata.next_page;
				_rpoints.loading.style.display='none';
				_rpoints.section.style.display='';
				_rpoints.section.innerHTML='';
				if(data.points_logs.length){
					_templates.logs.node.forEach(function(el){_rpoints.section.appendChild(el)});
					_templates.logs.rpoints.list.innerHTML=data.points_logs.map(_render_entry).join('');
				} else {
					_rpoints.section.appendChild(_templates.empty.node);
				}
			});
		}

		function _render_entry(el){
			return '<div class="section-table-piece-wrapper">\n<div class="section-table-piece-item unhoverable als" aria-label="Manual adjustment">\n<div class="section-table-piece-item-content">\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+el.source+'</div>\n<div class="section-table-piece-item-desc less-color">'+_number_format(el.points_amount, true)+' '+  translations.general_points +'</div>\n</div>\n</div>\n<div class="less-color text-nowrap">'+_date_format(el.applied_at)+'</div>\n</div>\n</div>';
		}

		var _loading;

		function _load_more(){
			if(!_next_page) return;
			if(_loading) return;
			_loading=true;
			_API.points_logs(_storage.customer.remote_id,_next_page).then(function(data){
				_next_page=data.metadata.next_page;
				data.points_logs.forEach(function(el){
					_templates.logs.rpoints.list.appendChild(_render_template(_render_entry(el)).node);
				});
				_loading=false;
			});
		}

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){return _footer;},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());


	//My rewards
	app.add_page('my_rewards',(function(){
		var _view=document.createElement('div');
		var _header='collapsed';
		var _footer='default';

		var rendered=_render_template('<div class="spin-wrapper ajax-interceptor ajax-loader-exit" data-rpoint="loading" style="display:none"></div>\n<div class="section-deep-panel" data-rpoint="section" style="display:none"></div>');

		var _templates={
			'empty':_render_template('<div>\n<div class="section-table-wrapper center-align  ">\n<div class=""></div>\n<div class="panel-top-wrapper ">\n<div class="panel-title head-title">' + translations.general_no_rewards_yet + '</div>\n</div>\n<div class="">' + translations.general_your_rewards_will_show_here + '</div>\n<button class="loy-button-link-main" data-action="app.page.toggle_back">' + translations.general_go_back + '</button>\n</div>\n</div>'),
			'ready':_render_template('<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_your_rewards + '</div>\n</div>\n<div class="section-table-wrapper" data-rpoint="current"></div>\n\n<div class="panel-top-wrapper">\n<div class="panel-title head-title ">' + translations.general_past_rewards + '</div>\n</div>\n<div class="section-table-wrapper" data-rpoint="past"></div>')
		};
		var _rpoints=rendered.rpoints;
		rendered.node.forEach(function(el){_view.appendChild(el)});

		var _listener=function(data){
			if(data.bottom>0.9) _load_more();
		}

		function _hide(){
			_view.style.display='none';
			psl_events.remove('app.container.scroll',_listener);
		}

		function _show(){
			return _render().then(function(){
				_view.style.display='';
				psl_events.on('app.container.scroll',_listener);
			});
		}

		var _next_page=0;

		function _render(){
			_rpoints.loading.style.display='';
			_templates.ready.rpoints.current.innerHTML=_storage.points_purchases.map(_render_active).join('');
			return _API.points_purchases(_storage.customer.remote_id, true).then(function(data){
				_next_page=data.metadata.next_page;
				_rpoints.loading.style.display='none';
				_rpoints.section.style.display='';
				_rpoints.section.innerHTML='';
				if(data.points_purchases.length || _storage.points_purchases.length){
					_templates.ready.node.forEach(function(el){_rpoints.section.appendChild(el)});
					_templates.ready.rpoints.past.innerHTML=data.points_purchases.map(_render_past).join('');
				} else {
					_rpoints.section.appendChild(_templates.empty.node);
				}
			});
		}

		function _load_more(){
			if(!_next_page) return;
			if(_loading) return;
			_loading=true;
			_API.points_purchases(_storage.customer.remote_id,true,_next_page).then(function(data){
				_next_page=data.metadata.next_page;
				data.points_logs.forEach(function(el){
					_templates.ready.rpoints.past.appendChild(_render_template(_render_past(el)).node);
				});
				_loading=false;
			});
		}

		function _render_past(el){
			return '<div class="section-table-piece-wrapper ">\n<div class="section-table-piece-item half-opacity unhoverable" aria-label="'+el.name+'">\n<div class="section-table-piece-item-content">\n'+reward.get_icon(el.reward.reward_type)+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+el.name+'</div>\n<div class="section-table-piece-item-desc less-color">Spent '+_number_format(el.points_amount, false)+' '+ translations.general_points +'</div>\n</div>\n</div>\n<div class="arrow tick"></div>\n</div>\n</div>\n</div>';
		}

		function _render_active(el){
			return '<div class="section-table-piece-wrapper ">\n<button class="section-table-piece-item " aria-label="'+el.name+'" data-action="app.redeem.show" data-data="'+el.id+'">\n<div class="section-table-piece-item-content">\n'+reward.get_icon(el.reward.reward_type)+'\n<div class="section-table-piece-item-text-container">\n<div class="section-table-piece-item-title">'+el.name+'</div>\n<div class="section-table-piece-item-desc less-color">' + translations.general_spent + ' ' +_number_format(el.points_amount, false) + ' ' + translations.general_points +'</div>\n</div>\n</div>\n<div class="arrow right"></div>\n</button>\n</div>';
		}

		_hide();

		var _ext={
			view:_view,
			header:function(){return _header;},
			footer:function(){return _footer;},
			show:_show,
			hide:_hide,
		}

		return _ext;
	})());

	window._init=function(){
		psl_events.emit('app.init');
	}
})();
