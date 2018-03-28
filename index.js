//$(function(){ 一件事情  })：在页面加载成功后做一件事情
$(function(){
	//Promise对象方法.then()
	//成功获取song.json文件就做什么事，失败就做什么事，当然这里没有写失败做什么事
	$.get("./songs.json").then(function(response){
		// console.log(response);
		//在本地开启服务器的情况下，请求得到.json文件，然后response会是 对象格式;
		//（network-单击songs.json-Headers中的content-type有说明它是json，所以jQuery才能知道是JSON对象，不会把它当作字符串）
		//如果代码上传到GitHub上，这里的response就会是字符串格式;
		//所以代码在上传到GitHub之前要把这里的代码改一下，改成如下;
		/*JSON.parse(responseStr)*/

		let items = response; //如果上传到GitHub上，这句代码就要修改成let items = JSON.parse(response);
		let $ulCt = $('.recomSgLt .song-list');		
		$(".loadingCt>img").addClass("loading");	
		initSongList(items,$ulCt,10);
		$(".loadingCt>img").removeClass("loading");
	})

	//实现siteNav的tab切换功能
	$(".site-nav").on("click",".nav-list>li",function(e){
		let $li = $(e.currentTarget); //这里的e.currentTarget得到DOM对象，把它转换为jQuery对象加$()
		$li.addClass("active").siblings().removeClass("active");
		let index = $(".nav-list>li").index($li);
		$(".pageContent>li").eq(index).addClass("active").siblings().removeClass("active");
	})

	//功能：点击“热歌榜”，发送AJAX请求得到json文件，将文件内容实现成html页面
	$(".nav-list>.hot").on("click",function(){
		//Promise的方法.then()来做一件事：
		//成功获取page2.json文件就将page2.json文件内容弄成“热歌榜的页面内容”
		$(".loadingCt>img").addClass("loading");				
		let $ulCt = $('.hotSgLt>.song-list');
		if($ulCt.attr("data-songLoaded")!=="yes"){
			$.get("./page2.json").then(function(response){
				let {bgUrl,bgSgs} = response;
				let items = bgSgs;
				setTimeout(function(){
					//生成热歌榜封面
					let $hotCover = $("<div class='hotCover'></div>");
					let $img = $("<img>");
					$img.attr("src",bgUrl);
					$img.appendTo($hotCover);
					$(".pageContent .hotSgLt").prepend($hotCover);
					initSongList(items,$ulCt,20);//生成歌曲列表这页面中的一个部分
					$(".loadingCt>img").removeClass("loading");						
					//生成底部歌曲链接
					let $checkLink = $("<a href='#' class='checkLink'>查看完整歌单></a>")
					$ulCt.append($checkLink);
				},1000)	
		    })
		}		
	    $ulCt.attr("data-songLoaded","yes");
	})
	

	// $(".nav-list>.ser").on("click",function(){
	// 	// console.log(".nav-list>.ser被点击了")
	// 	//Promise的方法.then()来做一件事：
	// 	//成功获取page3.json文件就将page3,json文件内容弄成“搜索页面的内容”
	// 	$.get("./page3.json").then(function(response){
	// 		console.log(response);
	// 		// htmlStr.appendTo($(".pageContent .hotSgLt"));
	// 	})
	// })

    //以下代码初始化歌曲列表，因为在页面有2个次方出现了，且内容格式和CSS样式也相同
    //，所以把代码提取出来写成一个提供调用的函数
	function initSongList(response,$ulCt,songNum){
		let items = []
		for(let i=0;i<songNum;i++){
			items.push(response[i]);
		}
		items.forEach(function(item){
			let {name,id,singer} = item;
			let $li =`
			<li>
				<a href="song.html?id=${id}" class="skip">
					<h3>${name}</h3>
					<p>
						<svg>
							<use xlink:href="#icon-highquality"></use>
						</svg>
					    ${singer}
				    </p>
					<a href="#" class="play">
						<svg>
						    <use xlink:href="#icon-play"></use>						
						</svg>
					</a>
				</a>				
		    </li>
			`;
			$ulCt.append($li);
		})		
	}

})