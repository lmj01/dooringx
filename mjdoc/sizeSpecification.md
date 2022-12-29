# 纸张大小规范

增加一个全局变量
dooringx\packages\dooringx-lib\src\core\store\storetype.ts中GlobalState添加一个字段

默认A4纸大小，新增两个大小，
用于标签文件、产品合格证以及快递单的大小
100x50mm
60x40mm


A4规格为210mmx297mm
一英寸是2.54cm=25.4mm
如果分辨率是72像素/英寸
210 / 25.4 * 72 = 595.2755905511812
297 / 25.4 * 72 = 841.8897637795276

在分辨率为72得情况下为 595宽高842

## 参考
[纸张大小像素关系](https://www.hangge.com/blog/cache/detail_1125.html)
	