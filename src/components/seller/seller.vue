<template>
  <div class="seller" ref="seller">
     <div class="seller-content">
       <div class="overview">
         <h1 class="title">{{seller.name}}</h1>
         <div class="desc">
           <star :size="36" :score="seller.score"></star>
           <span class="text">({{seller.ratingCount}})</span>
           <span class="text">月售{{seller.sellCount}}单</span>
         </div>
         <div class="remark">
           <div class="block">
             <h1 class="title">起送价</h1>
             <div class="content">
               <span class="stress">{{seller.minPrice}}</span>元
             </div>
           </div>
           <div class="block">
             <h1 class="title">商家配送</h1>
             <div class="content">
               <span class="stress">{{seller.deliveryPrice}}</span>元
             </div>
           </div>
           <div class="block">
             <h1 class="title">平均配送时间</h1>
             <div class="content">
               <span class="stress">{{seller.deliveryTime}}</span>分钟
             </div>
           </div>
         </div>
         <div class="favorite" @click="toggleFavorite">
           <span class="icon-favorite" :class="{'active': favorite}"></span>
           <div class="text">{{favoriteText}}</div>
         </div>
       </div>
       <div class="split"></div>
       <div class="bulletin">
         <h1 class="title">公告与活动</h1>
         <div class="content-wrapper border-1px">
           <p class="content">{{seller.bulletin}}</p>
         </div>
         <ul v-if="seller.supports" class="supports">
           <li class="support-item border-1px" v-for="(item,index) in seller.supports">
             <span class="icon" :class="classMap[seller.supports[index].type]"></span>
             <span class="text">{{seller.supports[index].description}}</span>
           </li>
         </ul>
       </div>
       <div class="split"></div>
       <div class="pic">
         <h1 class="title">商家实景</h1>
         <div class="pic-wrapper" ref="picWrapper">
           <ul class="pics" ref="pic">
             <li v-for="pic in seller.pics" class="pic-item">
               <img :src="pic" width="120" height="90">
             </li>
           </ul>
         </div>
       </div>
       <div class="split"></div>
       <div class="info">
         <h1 class="title border-1px">商家信息</h1>
         <ul class="info-content">
           <li v-for="info in seller.infos" class="info-item border-1px">{{info}}</li>
         </ul>
       </div>
     </div>
  </div>
</template>

<script>
import star from '../../components/star/star'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '../../common/js/store'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: (() => {
        // 读取favorate数据
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.seller, {
      click: true
    })
    this._initPics()
  },
  methods: {
    _initPics () {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        this.$refs.pic.style.width = (picWidth + margin) * this.seller.pics.length - margin + 'px'
        this.$nextTick(() => {
          if (!this.picWrapperScroll) {
            this.picWrapperScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          } else {
            this.picWrapperScroll.refresh()
          }
        })
      }
    },
    toggleFavorite () {
      this.favorite = !this.favorite
      // 存储favorate数据
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .seller
    position: absolute
    top: 176px
    left: 0
    right: 0
    bottom: 0
    max-width: 540px
    margin: 0 auto
    overflow: hidden
    .seller-content
      .overview
        padding: 18px
        position: relative
        .title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin-bottom: 8px
        .desc
          font-size: 0
          padding-bottom: 18px
          margin-bottom: 18px
          border-1px(rgba(7,17,27,.1))
          .star
            display: inline-block
            margin-right: 8px
            vertical-align: top
          .text
            vertical-align: top
            display: inline-block
            font-size: 10px
            color: rgb(77,85,93)
            line-height: 18px
            margin-right: 12px
        .remark
          display: flex
          .block
            flex: 1
            text-align: center
            border-right: 1px solid rgba(7,17,27,.1)
            &:last-child
              border-right: none
            .title
              font-size: 10px
              line-height: 10px
              color: rgb(147,153,159)
              margin-bottom: 4px
            .content
              font-size: 10px
              color: rgb(7,17,27)
              .stress
                font-size: 24px
                line-height: 24px
        .favorite
          position: absolute
          width: 50px
          right: 12px
          top: 18px
          text-align: center
          font-size: 0
          .icon-favorite
            display: inline-block
            color: #d4d6d9
            font-size: 24px
            line-height: 24px
            margin-bottom: 4px
            &.active
              color: rgb(240,20,20)
          .text
            font-size: 10px
            line-height: 10px
            color: rgb(77,85,93)
      .split
        width: 100%
        height: 16px
        border-top: 1px solid rgba(7,17,27,0.1)
        border-bottom: 1px solid rgba(7,17,27,0.1)
        background: #f3f5f7
      .bulletin
        padding: 18px 18px 0 18px
        .title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin-bottom: 8px
        .content-wrapper
          padding: 0 12px 16px 12px
          border-1px(rgba(7,17,27,.1))
          .content
            font-size: 12px
            font-weight: 200
            color: rgb(240,20,20)
            line-height: 24px
        .supports
          .support-item
            padding: 16px 12px
            font-size: 0
            border-1px(rgba(7,17,27,.1))
            &:last-child:after
              border-top: none
            .icon
              vertical-align: top
              display: inline-block
              width: 16px
              height: 16px
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .text
              font-size: 12px
              line-height: 16px
              color: rgb(7,17,27)
              font-weight: 200
      .pic
        padding: 18px
        .title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin-bottom: 12px
        .pic-wrapper
          white-space: nowrap
          font-size: 0
          .pic-item
            width: 120px
            height: 90px
            display: inline-block
            margin-right: 6px
            &:last-child
              margin-right: 0
      .info
        padding: 18px 18px 0 18px
        .title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          padding-bottom: 12px
          border-1px(rgba(7,17,27,.1))
        .info-content
          .info-item
            padding: 16px 12px
            font-size: 12px
            line-height: 16px
            color: rgb(7,17,27)
            font-weight: 200
            border-1px(rgba(7,17,27,.1))
            &:last-child:after
              border-top: none
</style>
