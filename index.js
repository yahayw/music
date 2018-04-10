
$(function(){
	$.get("./songs.json").then(function(response){
		let items = response; 
		let $ulCt = $('.recomSgLt .song-list');		
		$(".loadingCt>img").addClass("loading");	
		initSongList(items,$ulCt,10);
		$(".loadingCt>img").removeClass("loading");
	})
	$(".pageContent .playlist li").each(function(index){
		// console.log("index:",index);
		$(this).find("a").attr("href",`./playlist.html`)
	})

	//实现siteNav的tab切换功能
	$(".site-nav").on("click",".nav-list>li",function(e){
		let $li = $(e.currentTarget); 
		$li.addClass("active").siblings().removeClass("active");
		let index = $(".nav-list>li").index($li);
		$(".pageContent>li").eq(index).addClass("active").siblings().removeClass("active");
	})

	//功能：点击“热歌榜”，发送AJAX请求得到json文件，将文件内容实现成html页面
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

})