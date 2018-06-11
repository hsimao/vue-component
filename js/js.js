// select組件
Vue.component('select-component', {
    template: `
    <select v-model="selectLocation" @change="filterLocation">
        <option value=""> --- 請選擇城市 --- </option>
        <option :value="item" v-for="item in option">{{item}}</option>
    </select>
    `,
    data(){
        return {
            selectLocation: ''
        }
    },
    props: ['option'],
    methods: {
        filterLocation(){
            this.$emit('select-update', this.selectLocation)
        }
    }
})

// card 組件
Vue.component('card-component', {
    template: `
        <div>
            <div class="cards-tool">
                <h3 class="title">關注城市</h3>
            </div>
            <div class="cards follow">
                <div class="card" :class="statusColor(item.Status)" v-for="item in filterData">
                    <div class="card-top">
                        <div class="card-title">{{item.County}} - {{item.SiteName}}</div>
                        <div class="card-star-box" :class="{'active' : followActive(item.SiteName)}" @click="followToggleC(item.SiteName)">
                            <i class="star"></i>
                            <i class="star-active"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-aqi">AQI {{item.AQI}}</div>
                        <div class="card-pm">PM2.5 {{item['PM2.5']}}</div>
                        <div class="card-status">空氣狀況 {{item.Status}}</div>
                        <div class="card-time">更新時間 {{item.PublishTime}}</div>
                    </div>
                </div>
            </div>
            <div class="cards-tool">
                <h3 class="title">搜尋區域</h3>
            </div>
            <div class="cards">
                <div class="card" :class="statusColor(item.Status)" v-for="item in datas">
                    <div class="card-top">
                        <div class="card-title">{{item.County}} - {{item.SiteName}}</div>
                        <div class="card-star-box" :class="{'active' : followActive(item.SiteName)}" @click="followToggleC(item.SiteName)">
                            <i class="star"></i>
                            <i class="star-active"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-aqi">AQI {{item.AQI}}</div>
                        <div class="card-pm">PM2.5 {{item['PM2.5']}}</div>
                        <div class="card-status">空氣狀況 {{item.Status}}</div>
                        <div class="card-time">更新時間 {{item.PublishTime}}</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            current: '',
        }
    },
    props: {
        datas: {},
        follow: {},
        filterData: {}
    },
    methods: {
        statusColor(type){
            if (type === '良好') return 'color-1'
            if (type === '普通') return 'color-2'
            if (type === '對敏感族群不健康') return 'color-3'
            if (type === '對所有族群不健康') return 'color-4'
            if (type === '非常不健康') return 'color-4'
            if (type === '危害') return 'color-1'
        },
        followActive(city){
            return this.follow.some((item)=>{
                return item === city
            })
        },
        followToggleC(target){
            this.$emit('follow-update', target)
        }
    }
})


// 色卡組件
Vue.component('color-card', {
    template: `
        <ul class="colors" :class="{'active': isShow}" @click="isShow = !isShow">
            <li class="title">空氣色卡</li>
            <li class="color color-1"><span>良好</span></li>
            <li class="color color-2"><span>普通</span></li>
            <li class="color color-3"><span>對敏感族群不健康</span></li>
            <li class="color color-4"><span>對所有族群不健康</span></li>
            <li class="color color-5"><span>非常不健康</span></li>
            <li class="color color-6"><span>危害</span></li>
        </ul>
    `,
    data(){
        return {
            isShow: false
        }
    },
    methods: {
        makeCenter(el){
            const boxH = el.offsetHeight
            const viewH = document.documentElement.clientHeight || document.body.clientHeight
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            // 算換元素需要top多少才能置中的值: (螢幕高度 - 元素整體高度) / 2
            const top = ((viewH - boxH) / 2) + 30
            TweenMax.to(el, 1, {
                top: top + scrollTop,   // 更新元素top位置 : 置中高度 + 目前滾動距離
                ease: Power4.easeOut
            })
        },
    },
    mounted(){
        const _this = this
        const el = document.getElementsByClassName('colors')[0]
        window.addEventListener('scroll',()=>{
            this.makeCenter(el)
        })
    }
})

new Vue({
    el: '#app',
    data: {
        data: [],
        filterText: '',
        location: [],
        follow: ['基隆','汐止', '鳳山', '士林', '左營'],
    },
    methods: {
        getData(){
            const _this = this;
            const api = 'http://opendata2.epa.gov.tw/AQI.json';

            $.getJSON(api, function(data){
                _this.data = data
                _this.location = _this.filterCity
            })
        },
        targetCity(target){
            return this.filterText = target
        },
        getFollowInLocal() {
            const follow = localStorage.getItem('cityFollow')
            try {
                return follow ? JSON.parse(follow) : []
            } catch (e) {
                return []
            }
        },
        saveFollowInLocal(){
            localStorage.setItem('cityFollow', JSON.stringify(this.follow))
        },
        followToggle(target){
            // 如果已經follow, 就移除
            const followOnly = new Set(this.follow)
            if (followOnly.has(target)) {
                this.follow.splice(this.follow.indexOf(target), 1)
            //反之新增
            } else {
                this.follow.push(target)
                this.saveFollowInLocal()
            }
        },
    },
    computed: {
        // 過濾重複名稱，產生選項資料
        filterCity(){
            // 使用ES6 Set 方法改寫
            const citys = new Set(this.data)
            const location = new Set()
            for (let item of citys) {
                location.add(item.County)
            }
            return [...location]
        },
        // 依照選擇城市回傳值
        filterSelect(){
            if (this.filterText === '') return this.data
            const filterData = []
            this.data.forEach((item)=>{
                if (item.County === this.filterText) filterData.push(item)
            })
            return filterData
        },
        // 回傳follow資料
        followData(){
            const followData = []
            for (let i=0; i < this.follow.length; i++) {
                this.data.forEach((item)=>{
                    if (item.SiteName === this.follow[i]) followData.push(item)
                })
            }
            return followData
        }
    },
    created(){
        this.getData()
        this.follow = this.getFollowInLocal()
    }
})