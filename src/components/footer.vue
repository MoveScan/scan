<template>
  <div class="footer">
    <div class="container">
      <el-row>
        <el-col :span="3">
          <div class="developCenter">
            <h5><span>开发中心</span></h5>
            <ul class="list-unstyled quick-links">
              <!-- <li class="quick-links-li">
                <a href="#" target="_blank">Github</a>
              </li>
              <li class="quick-links-li">
                <a href="#" target="_blank">java-tron</a>
              </li>
              <li class="quick-links-li">
                <a href="#" target="_blank">
                  Documentation
                </a>
              </li>
              <li class="quick-links-li">
                <a href="#" target="_blank">Developer Hub</a>
              </li> -->
            </ul>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="aboutUsWrapper">
            <h5 class="text-capitalize"><span>关于我们</span></h5>
            <ul class="list-unstyled quick-links">
              <!-- <li class="quick-links-li text-capitalize">
                <a href="#"><span>团队介绍</span></a>
              </li>
              <li class="quick-links-li text-capitalize">
                <a href="#" target="_blank">
                  <span>帮助中心</span>
                </a>
              </li>
              <li class="quick-links-li text-capitalize">
                <a href="#" target="_blank">
                  <span>隐私协议</span>
                </a>
              </li>
              <li class="quick-links-li">
                <a href="#" target="_blank">
                  <span>服务条款</span>
                </a>
              </li> -->
            </ul>
          </div>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="15" class="flex">
          <el-icon>
            <Position />
          </el-icon>
          <el-icon>
            <ChatLineSquare />
          </el-icon>
          <el-icon>
            <Message />
          </el-icon>
        </el-col>
      </el-row>
      <div class="cp">Copyright© 2022 movescan.org</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Position, ChatLineSquare, Message } from '@element-plus/icons-vue'
</script>
<style>
.footer {
  border-top: 1px solid hsla(0, 0%, 6%, 0.05);
  margin-top: 2rem;
  padding: 3rem !important;
  background: rgba(190, 190, 190, 0.05);
}

.home-footer .quick-links .quick-links-li {
  margin: 6px 0;
}

.home-footer .quick-links a {
  color: #73787b;
  font-size: 12px;
  line-height: 16px;
}

.list-unstyled {
  list-style: none;
  padding-left: 0;
  text-align: left;
}

.quick-links-li {
  margin: 6px 0;
}

.quick-links a {
  color: #73787b;
  font-size: 12px;
  line-height: 16px;
}

.quick-links-li:hover {
  transform: translateX(10px);
}

.cp {
  font-size: 12px;
  color: #91979d;
}

.flex {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.flex i {
  margin: 10px;
}

.developCenter,
.aboutUsWrapper {
  text-align: left;
}
</style>
