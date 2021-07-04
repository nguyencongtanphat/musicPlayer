const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY='f8-player'
const heading =$('header h2');
const cdThumb = $('.cd-thumb');
const audio=$('#audio');
const cd=$('.cd');
const playBtn = $('.btn.btn-toggle-play')
const player=$('.player')
const progress=$('#progress')
const nextBtn=$('.btn.btn-next')
const preBtn=$('.btn.btn-prev')
const randomBtn=$('.btn.btn-random')
const repeatBtn=$('.btn.btn-repeat')
const playlist=$('.playlist')
const dashboard=$('.dashboard')


const app={

    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs:[
        {
            name:'Nevada',
            singer: 'Vicetone',
           path:'./asset/song/Nevada - Vicetone_ Cozi Zuehlsdorff.flac',
           image: './asset/img/Vicetone.jpg'
        },
        {
            name:'SummerTime',
            singer: 'K-391',
            path:'./asset/song/Summertime - K-391.flac',
            image:'./asset/img/K-391.jpg'
        },
        {
            name:'Monody',
            singer: 'TheFatRat',
            path:'./asset/song/TheFatRat - Warrior Songs - TheFatRat.mp3',
            image:'./asset/img/fatRat.jpg'
        },
        {
            name:'Reality',
            singer: 'Lost Frequencies',
            path:'./asset/song/Reality - Lost Frequencies_ Janieck Devy.flac',
            image:'./asset/img/Lost Frequencies feat. Janieck Devy.jpg'
        },
        {
            name:'Ngày Khác Lạ',
            singer: 'Đen',
            path:'./asset/song/Ngay Khac La - Den_ Giang Pham_ Triple D.flac',
            image:'./asset/img/Đen.jpg'
        },
        {
            name:'Lemon Tree',
            singer: 'DJ DESA REMIX',
            path:'./asset/song/Lemon Tree - Fools Garden.flac',
            image:'./asset/img/fools garden.jpg'
        },
        {
            name:'Sugar',
            singer: 'Maroon 5',
            path:'./asset/song/Sugar - Maroon 5.flac',
            image:'./asset/img/Maroon 5.jpg'
        },
        {
            name:'My Love',
            singer: 'Westlife',
            path:'./asset/song/My Love - Westlife.flac',
            image:'./asset/img/Westlife.jpg'
        },
        {
            name:' Attention',
            singer: 'Charlie Puth',
            path:'./asset/song/Attention - Charlie Puth.flac',
            image:'./asset/img/charlie puth.jpg'
        },
        {
            name:' Monsters ',
            singer: 'Katie Sky',
            path:'./asset/song/Monsters - Timeflies_ Katie Sky.flac',
            image:'./asset/img/Katie Sky.jpg',
        } 
    ],
    arrayIdRandom:[

    ], 
    render:function(){
      const htmls=this.songs.map((song, index)=>{
          return `
          <div class="song ${ index===this.currentIndex ?'active':''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>`
      })
      $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',
        {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function(){
        const _this=this;
        const cdWidth=cd.offsetWidth;
        //xu li cd quay
        const animationCd= cdThumb.animate([
            // keyframes
            {transform: 'rotate(360deg)'}
          ], {
            // timing options
            duration: 10000,
            iterations: Infinity
          })
          animationCd.pause();  
        //xu li scroll cd 
        document.onscroll=function(){
            const scrollTop=window.scrollY || document.documentElement.scrollTop;
            const newCdWidth= cdWidth-scrollTop;
            cd.style.width=newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity=newCdWidth/cdWidth;
        }
        //xu li khi click nut playlist
        playBtn.onclick=function(){
            if(_this.isPlaying)//pause
            {
                audio.pause();
            }else{ 
                audio.play(); 
            } 
        }
         // khi song duoc play
         audio.onplay=function(){
            _this.isPlaying=true;
                player.classList.add('playing')
                animationCd.play();
        }
        // khi song bi pause
        audio.onpause=function(){
            _this.isPlaying=false;
                player.classList.remove('playing')
                animationCd.pause();  
        }
       // khi tien do bai hat thay doi
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent= Math.floor(audio.currentTime / audio.duration * 100)
                progress.value=progressPercent
            }
        }
        //xuli khi tua songs
       progress.oninput=function(e){
            const seekTime =Math.floor((e.target.value*audio.duration) / 100)
            audio.currentTime= seekTime
       }
       // khi next chuyen song
       nextBtn.onclick=function(){
           if(_this.isRandom)
           {
            _this.playRandomSong();
            audio.play()
            _this.render();  
            _this.scrollToActiveSong()
           }
           else{
            _this.nextSong();
             audio.play()
             _this.render();
             _this.scrollToActiveSong()
           }
             //setBackGroundDashboard
        _this.setBackGroundDashboard();
       }
       //khi lui songs
       preBtn.onclick=function(){
            if(_this.isRandom)
            {
            _this.playRandomSong();
            audio.play()
            _this.render();
            _this.scrollToActiveSong()
            }
            else{
            _this.preSong();
             audio.play()
             _this.render();
             _this.scrollToActiveSong()
            }
              //setBackGroundDashboard
            _this.setBackGroundDashboard();
       } 
       // khi random songs
       randomBtn.onclick=function(){
        _this.isRandom=!_this.isRandom;
         randomBtn.classList.toggle("active")
       }
       // xu li khi end song
       audio.onended=function(){
           if(_this.isRepeat)
           {
                audio.play();
           }else
            nextBtn.click();
       }
       //xu li khi repeat
       repeatBtn.onclick=function(){
           _this.isRepeat=!_this.isRepeat
           repeatBtn.classList.toggle("active")
       }
       //lang nghe hanh vi click vao playlist
       playlist.onclick=function(e){
           //xu li khi click vao song
           const songNote=e.target.closest('.song:not(.active)')
          if(songNote || e.target.closest('.option'))
          {
              _this.currentIndex= Number(songNote.dataset.index)
              _this.render()
              _this.loadCurrentSong()
              _this.setBackGroundDashboard();
              audio.play()
          }
       }
    },
    scrollToActiveSong:function(){
       
       $('.song.active').scrollIntoView({
           behavior:'smooth',
           block:'center'
       })
    },
    loadCurrentSong: function(){
        
        heading.textContent=this.currentSong.name;
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`;
        audio.src=this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length)
            this.currentIndex=0;
        this.loadCurrentSong();
    },
    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        var newIndex;
        do{
            newIndex=Math.floor(Math.random()*this.songs.length);
        }while(newIndex==this.currentIndex || this.arrayIdRandom.indexOf(newIndex)!== -1);
        this.arrayIdRandom.push(newIndex);
        if(this.arrayIdRandom.length==this.songs.length)
        {
            this.arrayIdRandom.splice(0,this.songs.length);
            console.log(this.arrayIdRandom)
            this.arrayIdRandom.push(newIndex);
        }
        
            

             console.log(this.arrayIdRandom)
        this.currentIndex=newIndex;
        this.loadCurrentSong();
    },
    setBackGroundDashboard: function(){
        dashboard.style.backgroundImage=`url('${this.currentSong.image}')`
    },
    start: function(){
        //ding nghia cac thuoc tinh cho object
      this.defineProperties();
        //setBackGroundDashboard
      this.setBackGroundDashboard();
      //lang nghe cac su kien event cho object
      this.handleEvent();
        //thong tin bai hat dau tien vao UI(user interface) khi chay ung dung
      this.loadCurrentSong();
      //render lai playlist
      this.render();
    }
}

app.start()