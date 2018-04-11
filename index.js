
$(function(){
	$.get("./songs.json").then(function(response){
		let items = response; 
		let $ulCt = $('.recomSgLt .song-list');		
		$(".loadingCt>img").addClass("loading");	
		initSongList(items,$ulCt,10);
		$(".loadingCt>img").removeClass("loading");
	})
	$(".pageContent .playlist li").each(function(index){
		$(this).find("a").attr("href",`./playlist.html`)
	})

	//实现siteNav的tab切换功能
	$(".site-nav").on("click",".nav-list>li",function(e){
		let $li = $(e.currentTarget); 
		$li.addClass("active").siblings().removeClass("active");
		let index = $(".nav-list>li").index($li);
		$(".pageContent>li").eq(index).addClass("active").siblings().removeClass("active");
	})

	//功能：点击“热歌榜”，发送请求得到json文件，将文件内容实现成html页面
	$(".nav-list>.hot").on("click",function(){				
		$(".loadingCt>img").addClass("loading");	
		let $ulCt = $('.hotSgLt>.song-list');
		//获取今天的日期 月 日
		let today = new Date();
		let month = today.getMonth()+1;
		let date = today.getDate();
		let todayDate = `${month}月${date}日`;
		if($ulCt.attr("data-songLoaded")!=="yes"){
			$.get("./page2.json").then(function(response){
				let {bgUrl,bgSgs} = response;
				let items = bgSgs;
				timer = undefined;
				let $hotCover = $("<div class='hotCover'></div>");
				let $imgCt = $("<div class='img-ct'></div>")
				let $img = $("<img>");
				$img.attr("src",bgUrl);
				$img.appendTo($imgCt);
				$imgCt.appendTo($hotCover);
				let $p = $("<p>");
				$p.text(`更新日期：${todayDate}`);
			    $hotCover.append($p);
				$(".pageContent .hotSgLt").prepend($hotCover);
				initSongList(items,$ulCt,20);	
				let $checkLink = $("<a href='#' class='checkLink'>查看完整歌单></a>")
				$ulCt.append($checkLink);
		    })
		}		
		$(".loadingCt>img").removeClass("loading");				
	    $ulCt.attr("data-songLoaded","yes");
	})

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
    let $output = $(".search .srch-result .song-list");
    
    //实现搜索歌曲功能
    $("#srch-song").on('input',function(){    	
    	$(".search-area .clear").removeClass("hide");
    	$(".search .hot-search").addClass("hide");
    	let keyword = $(this).val().trim();
    	if(keyword===""){return;}
    	$output.removeClass("hide");    	 
    	if(timer){
    		clearTimeout(timer)
    	}
	    timer = setTimeout(function(){
			search(keyword).then((response)=>{
				clearTimeout(timer);
				if(response.length!==0){
					console.log(1);
					$output.text("");
					let length = response.length;
    				initSongList(response,$output,length);
				}
				else {
					console.log(2);
					$output.text("我们网易云没有这首歌");
				}		    			
    		});	    		
    	},1000);   	
    })
    $("#srch-song").on("focus",function(){
    	let con = $(this).val();    	
    	if(con===""){
	    	$(".search-area .clear").removeClass("hide");
	    	$(".search .hot-search").addClass("hide");
	    }
    })
    function search(keyword){
    	return new Promise((resolve,reject)=>{
    		let database = [{ "id":1,"name":"夜空中最亮的星", "singer":"逃跑计划"},{"id":2,"name":"她说","singer":"林俊杰"},{"id":3,"name":"曹操","singer":"林俊杰"},{"id":4,"name":"当你","singer":"林俊杰"},{"id":5,"name":"醉赤壁","singer":"林俊杰"},{"id":6,"name":"江南","singer":"林俊杰"},{"id":7,"name":"年轮","singer":"张碧晨"},{"id":8,"name":"越长大越孤单","singer":"牛奶咖啡"},{"id":9,"name":"扇子舞","singer":"李常超"},{"id":10,"name":"牵丝戏","singer":"银临"},{"id":11,"name":"锦鲤抄","singer":"银临"},{"id":12,"name":"老街","singer":"李荣浩"},{"id":13,"name":"超级英雄","singer":"邓超"},{"id":14,"name":"无敌","singer":"邓超"},{"id":15,"name":"倩女幽魂","singer":"张国荣"},{"id":16,"name":"我们不该这样的","singer":"张赫宣"},{"id":17,"name":"还魂门","singer":"胡彦斌"},{"id":18,"name":"男人KTV","singer":"胡彦斌"}, {"id":19,"name":"喜欢你","singer":"邓紫棋"},{"id":20,"name":"再见","singer":"邓紫棋"}];
	    	let result = database.filter((item)=>{ return item.name.indexOf(keyword)>=0 || item.singer.indexOf(keyword)>=0});
	    	resolve(result);
    	})
    }

    //清空歌曲输入框
    $(".search-area .clear").on("click",function(){
    	$("#srch-song").val("");
    	$(this).addClass("hide");
    	$output.addClass("hide");
    	$(".search .hot-search").removeClass("hide");
    })

    //点击热门搜索，显示搜索结果
    $(".search .hot-search button").on("click",function(){
    	let $this = $(this);
    	let keyword = $this.text();
    	search(keyword);
    })
})