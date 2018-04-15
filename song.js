$(function(){
	let pageWidth = document.documentElement.clientWidth;
	let rootFZ = pageWidth/16;
	let id = parseInt(location.search.match(/\bid=([^&]*)/)[1]);
	$.get("/songs.json").then(function(response){
		let songs = response;
		let song = songs.filter(sn=>sn.id===id)[0];
		let {url,name,singer,lyric} = song;
		initPlayer(url); //等价于这个写法：initPlayer.call(undefined,url); 
		initSongText.call(undefined,name,singer,lyric);		
	})
	function initPlayer(url){
		initCoverBg(id);
		let audio = $("<audio src=''></audio>");
		audio = audio[0]; //jQuery对象转换为dom对象，后面的play等方法都要求是dom对象的
		audio.src = url;
		let btnPause = $(".icon-pause");
		let btnPlay = $(".icon-play");
		let discCt = $(".disc-contain");
		// audio.oncanplay = function(){
		// 	audio.play();
		// 	discCt.addClass("playing");
		// }
		btnPause.on("click",function(){
			audio.pause();
			discCt.removeClass("playing");
		})
		btnPlay.on("click" ,function(){	
			audio.play();
			discCt.addClass("playing");
			scrollLyric.call(undefined,audio);	
		})
		audio.onended = function(){
			discCt.removeClass("playing");
			$(".lyric P").css("transform",`translateY(0px)`);
		}
		
		
	}
	function initSongText(songNam,singer,lyric){
		//添加歌名、演唱者		
		$(".song-desc .song-name").html(`${songNam}-<span class="singer">${singer}</span>`);	

		//添加歌词
		let lyricArr = lyric.split("\n");
		let $lyric= $(".song-desc .lyric");
		lyricArr.forEach(function(ele){
			let $p = $("<p>");
			let regExp = /\[(.+)\](.+)/;
			let matches = ele.match(regExp);
			if(matches){
				let dataTime = matches[1];
				let lyricText = matches[2];
				$p.attr("data-time",dataTime).text(lyricText);
			    $p.appendTo($lyric);
			}			
		})
	}
	function scrollLyric(audio){
		let curTime,minute,second;
	    let $p = $(".lyric P");
		let timer = setInterval(function(){
			curTime = audio.currentTime;
			minute = ~~(curTime/60);
			second = curTime-minute*60;
			if(minute<10){
				minute = `0${minute}`;
			}
			if(second<10){
				second = `0${second}`;
			}
			curTime = minute+":"+second;
	    	for(let i=0; i<$p.length; i++){
	    		if( i!==($p.length-1) && $p.eq(i).attr("data-time")<=curTime && $p.eq(i+1).attr("data-time")>curTime){
	    			$p.eq(i).addClass("active");
					$p.eq(i).prev().removeClass("active");
					let lineHeight = 1.538*rootFZ;
	    		    let height = (i-1) * lineHeight;
	    			$p.css("transform",`translateY(-${height}px)`);
	    		}else if(i === ($p.length-1)){
	    			$p.eq(i).addClass("active");
	    			$p.eq(i).prev().removeClass("active");
	    		}
	        }
	    },600);
	}
	function initCoverBg(id){
		let $coverImg = $(".disc-contain .cover");
		$coverImg.attr("src",`imgs/song/${id}cover.webp`);
		let $pageBg = $(".page-bac");
		let bgUrl = `imgs/song/${id}bg.jpg`;
		$pageBg.css("background",`url(${bgUrl}) no-repeat center 0`);
		$pageBg.css("background-size","auto 110vh");
	}
		
})

