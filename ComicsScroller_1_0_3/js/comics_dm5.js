console.log("reader starts");
// var comics=comics || { };
document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		comics.setImages=function(doc){
			comics.preChapter.style.display="none";
			var script1=/<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
			eval(script1);
			comics.titleInfor=DM5_CTITLE.toString();
			comics.pageMax=DM5_IMAGE_COUNT;
			comics.chaptertxt.textContent=comics.titleInfor+"  第1/"+comics.pageMax+"頁";
			var scriptURL=doc.evaluate("/html/head/script[10]",doc,null,XPathResult.ANY_TYPE,null).iterateNext().getAttribute('src');
			comics.chapterId=DM5_CID.toString();
			var nextURLnode=doc.evaluate("//*[@id=\"index_right\"]/div[2]/div[2]/span[2]/a",doc,null,XPathResult.ANY_TYPE,null).iterateNext();
			if(nextURLnode==null){
				comics.nextURL_tmp="";
				comics.maxChapter_tmp=comics.chapterId;	
			}else{
				comics.nextURL_tmp=nextURLnode.getAttribute('href');
			}
			
			var img=[];
			for(var i=0;i<comics.pageMax;++i){
				img[i]=doc.URL+"chapterfun.ashx?cid="+comics.chapterId+"&page="+(i+1)+"&key=&language=1";
			}
			comics.images=img;
		};		
		comics.maxChapter="";
		comics.createItem();
		comics.setImages(document);
		comics.nextURL=comics.nextURL_tmp;
		if(comics.nextURL==""){
			comics.maxChapter=comics.chapterId;
			comics.nextChapter.style.display="none";
		}
		comics.appendImage();	
		echo.init({
	    	offset: 2500,
	    	throttle: 100,
	    	unload: false,
	    	update: function () {
	    		if(comics.nextURL!==""){
		        	var req=new XMLHttpRequest();
				    req.open("GET","http://tel.dm5.com"+comics.nextURL_tmp,true);
				    req.responseType="document";
				    req.onload=function(){
				      // console.log(req.response);
				      var doc=req.response;
				      comics.setImages(doc);
				      comics.appendImage();
				    };
				    req.send();
				}
	    	},
	    	imgRender: function(elem){
	    		return (function(){
				    		var req=new XMLHttpRequest();
							req.open("GET",elem.getAttribute("data-echo"),true);
							req.onload=function(){
							  return (function(){
							  	eval(req.response);
							  	if (typeof (hd_c) != "undefined" && hd_c.length > 0) {
                    				elem.src=hd_c[0];
                				}else{
                					elem.src=d[0];
                				}
                				elem.removeAttribute('data-echo');
							  })(elem,req);
							};
							req.send();
	    		})(elem);
	    	},
	    	setInViewInfor: function(){
			    var nodes = document.querySelectorAll('img[data-title]');    
			    var oview={
			      l: 0,
			      t: 0,
			      b: (window.innerHeight || document.documentElement.clientHeight),
			      r: (window.innerWidth || document.documentElement.clientWidth)
			    };
			    for (var i = 0; i < nodes.length; i++) {
			      var elem=nodes[i];
			      if(echo.checkView(elem, oview)){
			      	// console.log("elem :"+elem.getAttribute("data-chapter")+"  "+comics.chapterId);
			        if(comics.chaptertxt.textContent!==elem.getAttribute("data-title")){
			          comics.chaptertxt.textContent=elem.getAttribute("data-title");  
			        }
			        if(elem.getAttribute("data-chapter")!==comics.chapterId){
			          console.log("set URL");	
			          comics.nextURL=comics.nextURL_tmp;
			          console.log(comics.nextURL);
			          comics.preURL=comics.preURL_tmp;
			          comics.maxChapter=comics.maxChapter_tmp;
			        }
			        // console.log("maxChapter "+comics.maxChapter);
			        if(elem.getAttribute("data-chapter")==comics.maxChapter){
			          comics.nextChapter.style.display="none";
			        }else{
			          comics.nextChapter.style.display="inline-block";
			        }
			        return;
			      }
			    }
			}
		});
	}
}
