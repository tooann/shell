<template>
  <transition name="bounce">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back">
            <i class="icon-close" @click="hideFood"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <div class="split" v-show="food.info"></div>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <div class="split"></div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selecttype="selecttype" @content="content"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                <span class="text-content">{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
            暂无评价
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
 import Vue from 'vue'
 import BScroll from 'better-scroll'
 import { eventBus } from '../../components/event-bus'
 import cartcontrol from '../../components/cartcontrol/cartcontrol.vue'
 import ratingselect from '../../components/ratingselect/ratingselect.vue'
 import {formatDate} from '../../common/js/formatDate'

 const ALL = 2

 export default {
   props: {
     food: {
       type: Object
     }
   },
   data () {
     return {
       showFlag: false,
       selectType: ALL,
       onlyContent: true,
       desc: {
         all: '全部',
         positive: '推荐',
         negative: '吐槽'
       }
     }
   },
   methods: {
     show () {
       this.showFlag = true
       this.$nextTick(() => {
         if (!this.foodScroll) {
           this.foodScroll = new BScroll(this.$refs.food, {
             click: true
           })
         } else {
           this.foodScroll.refresh()
         }
       })
     },
     hideFood () {
       this.showFlag = false
     },
     addFirst (event) {
       // 优化体验，异步传递当前点击文档
       this.$nextTick(() => {
         eventBus.$emit('addcart', event.target)
       })
       Vue.set(this.food, 'count', 1)
     },
     selecttype (type) {
       this.selectType = type
       // 手动刷新better-scroll重新计算页面高度
       this.$nextTick(() => {
         this.foodScroll.refresh()
       })
     },
     content () {
       this.onlyContent = !this.onlyContent
       // 手动刷新better-scroll重新计算页面高度
       this.$nextTick(() => {
         this.foodScroll.refresh()
       })
     },
     needShow (type, text) {
       if (this.onlyContent && !text) {
         return false
       }
       if (this.selectType === ALL) {
         return true
       } else {
         return type === this.selectType
       }
     }
   },
   filters: {
     formatDate (time) {
       let date = new Date(time)
       return formatDate(date, 'yyyy-MM-dd hh:mm')
     }
   },
   components: {
     cartcontrol,
     ratingselect
   }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .food
    max-width: 540px
    position: fixed
    width: 100%
    z-index: 2
    top: 0
    left: 0
    right: 0
    margin: 0 auto
    bottom: 48px
    background: #fff
    &.bounce-enter-active
      animation: bounce-in .3s
    &.bounce-leave-active
      animation: bounce-in .3s reverse
    @keyframes bounce-in
      0%
        transform: scale(0)
      100%
        transform: scale(1)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-bottom: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 12px
          left: 0
          .icon-close
            display: inline-block
            padding: 10px
            color: #fff
            font-size: 20px
      .content
        position: relative
        padding: 18px
        .title
          font-size: 14px
          line-height: 14px
          font-weight: 700
          color: rgb(7,17,27)
          margin-bottom: 8px
        .detail
          font-size: 10px
          line-height: 10px
          color: rgb(147,153,159)
          margin-bottom: 18px
          .sell-count
            margin-right: 12px
        .price
          font-size: 14px
          font-weight: 700
          line-height: 24px
          color: rgb(240,20,20)
          .old
            font-size: 10px
            font-weight: 700
            line-height: 24px
            color: rgb(147,143,159)
            text-decoration: line-through
            margin-left: 10px
        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          padding: 0 12px
          height: 24px
          line-height: 24px
          background: rgb(0,160,220)
          font-size: 10px
          color: rgb(255,255,255)
          border-radius: 12px
          opacity: 1
          &.fade-enter-active, &.fade-leave-active
             transition: opacity .5s
          &.fade-enter, &.fade-leave-to /* .fade-leave-active in below version 2.1.8 */
             opacity: 0
      .split
        height: 16px
        border-top: 1px solid rgba(7,17,27,0.1)
        border-bottom: 1px solid rgba(7,17,27,0.1)
        background: #f3f5f7
      .info
        padding: 18px
        .title
          font-size: 14px
          line-height: 14px
          margin-bottom: 6px
          color: rgb(7,17,27)
          font-weight: 500
        .text
          padding: 0 8px
          font-size: 12px
          font-weight: 200
          color: rgb(77,85,93)
          line-height: 24px
      .rating
        padding: 18px 18px 12px 18px
        border-bottom: 1px solid rgba(7,17,27,.1)
        .title
          font-size: 14px
          line-height: 14px
          margin-bottom: 6px
          color: rgb(7,17,27)
          font-weight: 500
      .rating-wrapper
        padding: 0 18px
        .rating-item
          padding: 16px 0
          border-1px(rgba(7,17,27,.1))
          .user
            position: absolute
            right: 0
            top: 16px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              font-size: 10px
              line-height: 12px
              color: rgb(147,153,159)
              vertical-align: top
            .avatar
              border-radius: 50%
              vertical-align: top
          .time
            font-size: 10px
            color: rgb(147,153,159)
            line-height: 12px
          .text
            margin-top: 6px
            font-size: 0
            .icon-thumb_down
              display: inline-block
              margin-right: 4px
              font-size: 12px
              color: rgb(147,153,159)
              line-height: 16px
              vertical-align: top
            .icon-thumb_up
              display: inline-block
              margin-right: 4px
              font-size: 12px
              color: rgb(0,160,220)
              line-height: 16px
              vertical-align: top
            .text-content
              font-size: 12px
              color: rgb(7,17,27)
              line-height: 16px
        .no-rating
          padding: 12px 0
          font-size: 12px
          color: rgb(147,153,159)

</style>
