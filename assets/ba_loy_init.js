"use strict";

(function(){
	window.addEventListener('message',function(e){
			switch(e.data.msg_action){
				case 'widget.register':
					window.location.href='/account/register';
				break;
				case 'widget.login':
					window.location.href='/account/login';
				case 'widget.apply_discount_code':
					_apply_discount_code(e.data.msg_options)
				break;
				case 'widget.visit':
					window.location.href = e.data.msg_options.url;
				break;
				case 'widget.close':
					_toggle(false);
				break;
			}
	});

	var _toggle;

	function _apply_discount_code(params){
		var url='/discount/'+ params.code;
		var data={
			method: "GET"
		};
		return new Promise(function(resolve,reject){
			fetch(url,data).then(function(response){
				if (params.variant_ids === undefined) {
					return resolve({});
				}

				var variants = params.variant_ids.split(',');
				if (variants.length === 0) {
					return resolve({});
				}

				if (variants.length === 1) {
					return fetch('/cart/add.js', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							items: [{
								id: variants[0],
								quantity: 1
							}]
						})
					}).then(function(response){
						window.location = '/cart';
						return resolve({});
					});
				}

				var end_point = window.BoosterApps.loy_config.api_endpoint;
				return fetch(end_point + '/products/' + params.product_id, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response){
					return response.json();
				}).then(function(data){
					window.BoosterApps.sendMessageToWidget({msg_action: 'app.redeem.product-options', msg_options: data});
					return resolve({});
				});

			}).catch(function(e){
				console.error(e);
				resolve({});
			});
		});
	}

  function getQueryParams() {
    var queryParamsString = window.location.search.substr(1);
    return queryParamsString.split('&').reduce(function(acc, queryParam) {
      var tokens = queryParam.split('=');
      acc[tokens[0]] = tokens[1];
      return acc;
    }, {});
  }

  function getDeepLinks() {
    var params = getQueryParams();
    var deepLinks = {};
    if (params['preset_type'] === 'loyalty_points_redeemed') {
      deepLinks['page'] = 'reward_page';
      deepLinks['reward_id'] = params['record_id'];
    }
    return deepLinks;
  }

  window.BoosterApps.deepLinks = getDeepLinks();

	window.addEventListener('load',function(){
		if (window.BoosterApps.loy_config.points_program_enabled != true){return;}
		var loyScriptPresent = (document.getElementsByTagName('head')[0].innerHTML.search("loy_" + window.BoosterApps.common.shop.id) > 0);
		if (!loyScriptPresent){return;}

		var style=document.createElement('style');
		var customStyle = window.BoosterApps.loy_config.custom_css;
		var launcherImg = '<?xml version="1.0" encoding="iso-8859-1"?><svg id="ba-loy-launcher-img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 512.002 512.002" xml:space="preserve"><g><g><path fill="#fff" fill-rule="nonzero" d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157'
					+ 'c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065'
					+ 'c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671'
					+ 'c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638'
					+ 'l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955'
					+ 'C511.56,208.649,513.033,202.688,511.267,197.258z"/></g></g></svg>'

		style.innerHTML='#ba-loy-container-body {overflow: hidden !important;}\niframe#ba-loy-frame{position: absolute !important;opacity: 0 !important;width: 1px !important;height: 1px !important;top: 0 !important;left: 0 !important;border: none !important;display: block !important;z-index: -1 !important;}\n.ba-loy-namespace .ba-loy-app {line-height: 1;}\n.ba-loy-namespace div,.ba-loy-namespace frame {display: block;}\n.ba-loy-namespace div,\n.ba-loy-namespace span,\n.ba-loy-namespace iframe {font-family: ba-loy-font, "Helvetica Neue", "Apple Color Emoji", Helvetica, Arial, sans-serif;font-size: 100%;font-style: normal;letter-spacing: normal;font-stretch: normal;font-variant: normal;font-weight: normal;text-align-last: initial;text-decoration: none;text-indent: 0px;text-shadow: none;text-transform: none;alignment-baseline: baseline;animation-play-state: running;backface-visibility: visible;background-color: transparent;background-image: none;baseline-shift: baseline;border: 0px none transparent;border-radius: 0px;bottom: auto;-webkit-box-decoration-break: slice;box-shadow: none;box-sizing: content-box;caption-side: top;clear: none;clip: auto;color: inherit;columns: auto auto;column-fill: balance;column-gap: normal;content: normal;counter-increment: none;counter-reset: none;cursor: auto;direction: ltr;display: inline;dominant-baseline: auto;empty-cells: show;float: none;height: auto;-webkit-hyphenate-character: auto;hyphens: manual;image-rendering: auto;left: auto;line-height: inherit;list-style: outside none disc;margin: 0px;max-height: none;max-width: none;min-height: 0px;min-width: 0px;opacity: 1;orphans: 2;outline-offset: 0px;overflow: visible;padding: 0px;page: auto;break-after: auto;break-before: auto;break-inside: auto;perspective: none;perspective-origin: 50% 50%;pointer-events: auto;position: static;quotes: none;resize: none;right: auto;size: auto;table-layout: auto;top: auto;transform: none;transform-origin: 50% 50% 0px;transform-style: flat;unicode-bidi: normal;vertical-align: baseline;white-space: normal;widows: 2;width: auto;word-break: normal;word-spacing: normal;overflow-wrap: normal;z-index: auto;text-align: start;-webkit-font-smoothing: antialiased;}\n@media (max-width: 500px) {\n	.ba-loy-namespace .ba-loy-messenger-frame,\n	#launcher-wrapper{right: 10px;}\n}\n.ba-loy-namespace .ba-loy-messenger-frame {z-index: 2147483650;position: fixed;bottom: 90px;right: 20px;width: 376px;min-height: 450px;max-height: 700px;box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;border-radius: 8px;overflow: hidden;opacity: 1;height: calc(100% - 120px);}\n.ba-loy-namespace .ba-loy-messenger-frame>iframe {width: 100%;height: 100%;position: absolute;}\n#ba-loy-container-body {overflow: hidden;}\n#launcher-wrapper {position: fixed;z-index: 99999999999;bottom: 20px;right: 20px;display: flex; height: 60px; align-items: center;justify-content: center;cursor: pointer;color:white;background: #0749d1;border-radius: 30px;min-width:60px;}\n#launcher-wrapper *{cursor: pointer;}\n#launcher-wrapper > *{padding: 16px 14px;transition:all 300ms cubic-bezier(0.87, 0, 0.13, 1);}\n#launcher-wrapper > .opened{position: relative;z-index:2;width:auto;display: inline-flex;align-items: center;max-width:250px;box-sizing:border-box;}\n#launcher-wrapper > .closed{position: absolute;top: 0px;left: 0px;bottom: 0px;width: 30px; opacity:0;z-index:1;}\n#launcher-wrapper .launcher-icon{width:30px;height:30px;margin-right: 12px;}\n#launcher-wrapper .launcher-text{display:inline-block;vertical-align:top;line-height:normal;margin-right: 10px;}\n#launcher-wrapper .launcher-close-icon{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath fill=\'%23fff\' fill-rule=\'nonzero\' d=\'M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z\'/%3E%3C/svg%3E%0A");width: 26px;height: 26px;display: block;background-size: 26px;}\n#launcher-wrapper.up > .opened{opacity:0;max-width:60px;}\n#launcher-wrapper.up > .closed{opacity:1;}\nsvg#ba-loy-launcher-img{width:30px;height:30px;}\n#ba-loy-launcher-img > path {fill: #fff;}' + customStyle;
		document.head.appendChild(style);

		var node=document.createElement('div');
		node.id="ba-loy-container";
		node.className="ba-loy-namespace";
		node.innerHTML='<div class="ba-loy-app">\n<div class="ba-loy-messenger-frame" id="loy-widget-wrapper" style="display:none;">\n<iframe id="ba-other-window-body" allowfullscreen="" src="about:blank" sandbox="allow-scripts allow-same-origin"></iframe>\n</div>\n<div id="launcher-wrapper">\n<div class="opened">\n<div class="launcher-icon">' + launcherImg + '</div>\n<div class="launcher-text">'+ window.BoosterApps.loy_config.launcher_style_settings.text +'</div>\n</div>\n<div class="closed">\n<div class="launcher-close-icon close-loy-button"></div></div>\n</div>\n</div>\n</div>';

		var rpoints={
			container:node.querySelector('#loy-widget-wrapper'),
			iframe:node.querySelector('iframe'),
			button:node.querySelector('#launcher-wrapper'),
		};
		document.body.appendChild(node);

		rpoints.button.addEventListener('click',function(){
			_toggle(!shown);
		});

		_toggle = function(status){
			shown = status;
			rpoints.button.classList[shown ? 'add' : 'remove']('up');
			rpoints.container.style.display=shown ? '' : 'none';
			if (shown) _init(rpoints.iframe);
		}

    if (window.BoosterApps.deepLinks['page']) {
      _toggle(true);
    }
	});

	var shown=false;
	var inited=false;

	function _init(iframe){
		if(inited){
			iframe.contentWindow.postMessage({msg_action:'event.opened', msg_options:{}}, '*');
		} else {
			inited=true;
    	var shop=window.BoosterApps?window.BoosterApps.common.shop:undefined
			var customer=window.BoosterApps?window.BoosterApps.common.customer:undefined;
			var customCSS=window.BoosterApps?window.BoosterApps.loy_config.custom_css:undefined;
     	iframe.contentWindow.document.write('<html lang="en">\n<head>\n<title></title>\n<script src="https://polyfill.io/v3/polyfill.min.js?features=Promise%2Cfetch"></script>\n<link rel="stylesheet" href="' + window.ba_loy_widget_css + '">\n'+(shop?('<script>window.shop='+JSON.stringify(shop)+';</script>'):'')+'\n'+(customer?('<script>window.customer='+JSON.stringify(customer)+';</script>'):'')+'\n<script src="' + window.ba_loy_widget_js + '"></script>\n<style type="text/css">' + customCSS + '</style></head>\n<body><div class="spin-wrapper ajax-interceptor ajax-loader-out"></div></body>\n<script>\nwindow._init();\n</script>\n</html>');
			iframe.contentWindow.BoosterApps = window.BoosterApps;
			window.BoosterApps.sendMessageToWidget = function(data) {
				iframe.contentWindow.postMessage(data, '*');
			}
		}
	}
})();
