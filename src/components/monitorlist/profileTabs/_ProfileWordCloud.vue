<template>
    <div class="h-100 word-cloud-container pt-4 mt-3 mt-xl-0" style="min-height: 400px;">
        <span class="h5 font-weight-bold">WordCloud</span>
        <hr class="">
        <!-- {{ wordcloud_images }}
        {{ words.lenght }} -->
        <img
            v-if="wordcloud_image"
            :src="myImage(wordcloud_image)"
            id="img-tab"
            style="width:100%"
        />
         <div v-else class="h-100">
            <!-- <span v-if="words.length === 0"  class="font-weight-normal text-secondary pt-3">ไม่พบข้อมูล</span> -->
            <div ref="cloud" class="h-100"></div>
         </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import chroma from 'chroma-js'
export default {
    name: 'WordCloud',
    props: {
        wordcloud_image: {
            type: String,
            // required: true,
            default: () => ""
        },
        words: {
            type: Array,
            required: true,
            default: () => []
        },
        width: {
            type: Number,
            default: 720
        },
        height: {
            type: Number,
            default: 480
        }
    },
    data() {
        return {
            dataTest: {
                happy: 199,
                sad: -3,
                neutral: 0,
                excited: 7,
                angry: -6
            },
            colorMap: [] // สีของแต่ละคำ
        }
    },
    watch: {
        words: {
            handler() {
                // this.generateColorMap();
                this.assignColorToData();
                this.drawCloud(); // redraw เมื่อเปลี่ยน words
                // if (newVal && newVal.length > 0) {
                    
                // }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        myImage(imageCode) {
            if (imageCode) {
                return (
                    `data:image/jpeg;base64,` +
                    imageCode.substring(2).replace("'", "")
                );
            }else {
                return "";
            }
        },
        handleWordClick(word) {
            console.log("word === ", word);
            
            // ทำสิ่งที่ต้องการ เช่น แสดง modal, เปลี่ยนข้อมูล
            alert(
                `คุณคลิกที่คำว่า: ${word.text}/score : ${word.score} / count :  ${word.count} /  color : ${word.color}`
            );
        },
        // getSentimentColor(sentiment) {
        //     if (sentiment === 1) {
        //         const r = Math.floor(Math.random() * 50) + 30;    // 30 - 79 (ช่วยลด contrast)
        //         const g = Math.floor(Math.random() * 100) + 100;  // 100 - 199 (ไม่เกิน 200 เพื่อลดความสว่าง)
        //         const b = Math.floor(Math.random() * 50) + 30;    // 30 - 79
        //         return `rgb(${r}, ${g}, ${b})`;
        //     } else if (sentiment === 0) {
        //         const start = { r: 218,  g:214,  b: 1 };   // #dad601
        //         const end   = { r: 253, g: 208, b: 113 }; // #fdd071

        //         // สุ่มค่าระหว่าง start และ end
        //         const r = Math.floor(Math.random() * (end.r - start.r + 1)) + start.r;
        //         const g = Math.floor(Math.random() * (end.g - start.g + 1)) + start.g;
        //         const b = Math.floor(Math.random() * (end.b - start.b + 1)) + start.b;

        //         return `rgb(${r}, ${g}, ${b})`;
        //     } else if (sentiment === -1) {
        //         // โทนแดง: hue 0–10
        //         return  '#fa0608';
        //     } else {
        //         // fallback สีเทา
        //         return '#95a5a6';
        //     }
        // },
        
        drawCloud() {
            // const fill = d3.scaleOrdinal(d3.schemeTableau10); // เปลี่ยนสีดูโมเดิร์นขึ้น
            const layout = cloud()
                .size([this.width, this.height])
                .words(this.words)
                .padding(2)
                .rotate(() => ~~(Math.random() * 2) * 90)
                .font('sans-serif')
                .fontSize(d => d.size)
                .on('end', this.draw);

            layout.start();
            
        },
        draw(words) {
            const el = d3.select(this.$refs.cloud);
            el.selectAll('*').remove(); // เคลียร์ของเดิม

            const svg = el.append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .append('g')
                .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

            svg.selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => `${ d.size}px`)
            .style('font-family', 'Sarabun, sans-serif')
            .style('font-weight', 100) 
            
            .style('cursor', 'pointer')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
            .attr('fill', d => d.color || '#95a5a6') // ✅ ใช้สีจาก word.color
            .on('click', (event, d) => this.handleWordClick(d)); // ✅ เพิ่มตรงนี้
        },
        assignColorToData( rng = 11) {
            if (rng % 2 === 0) rng += 1;
            const mid = Math.floor(rng / 2);

            const maxVal = this.words.length
            ? Math.max(...this.words.map(item => Math.abs(item.score)))
            : 1;

            function hexToRgb(hex) {
            const bigint = parseInt(hex.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
            };
            }

            function rgbToHex(r, g, b) {
            return (
                '#' +
                [r, g, b]
                .map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                })
                .join('')
            );
            }

            function interpolateColor(c1, c2, t) {
            return {
                r: Math.round(c1.r + (c2.r - c1.r) * t),
                g: Math.round(c1.g + (c2.g - c1.g) * t),
                b: Math.round(c1.b + (c2.b - c1.b) * t),
            };
            }

            // Gradient: Red → Yellow → Green
            const red = '#ff0000';
            const yellow = '#ffff00';
            const green = '#00cc00';

            const startRGB = hexToRgb(red);
            const middleRGB = hexToRgb(yellow);
            const endRGB = hexToRgb(green);

            const colors = [];
            const halfSteps = Math.floor(rng / 2);

            // แดง → เหลือง
            for (let i = 0; i < halfSteps; i++) {
            const t = i / (halfSteps - 1);
            const c = interpolateColor(startRGB, middleRGB, t);
            colors.push(rgbToHex(c.r, c.g, c.b));
            }

            // เหลือง → เขียว
            for (let i = 1; i <= rng - halfSteps; i++) {
            const t = i / (rng - halfSteps);
            const c = interpolateColor(middleRGB, endRGB, t);
            colors.push(rgbToHex(c.r, c.g, c.b));
            }

            // ใส่ color ลงในแต่ละ this.words[index]
            this.words.forEach((item, index) => {
            const normalized = item.score / maxVal; // -1 → 1
            const level = mid + Math.round(normalized * mid);
            const colorIndex = Math.max(0, Math.min(rng - 1, level));
            item.color = colors[colorIndex];
            });
        }



        // generateColorMap() {
        //     console.log("words === ", this.words);

        //     // แยกกลุ่มตาม sentiment
        //     const positive = this.words.filter(w => w.sentiment === 1).sort((a, b) => b.count - a.count)
        //     const neutral  = this.words.filter(w => w.sentiment === 0).sort((a, b) => b.count - a.count)
        //     const negative = this.words.filter(w => w.sentiment === -1).sort((a, b) => b.count - a.count)

        //     // หา count สูงสุดแต่ละกลุ่ม เพื่อ normalize
        //     const maxPos = Math.max(...positive.map(w => w.count), 1);
        //     const maxNeu = Math.max(...neutral.map(w => w.count), 1);
        //     const maxNeg = Math.max(...negative.map(w => w.count), 1);

        //     console.log("maxPos : ",maxPos);
        //     console.log("maxNeu : ",maxNeu);
        //     console.log("maxNeg : ",maxNeg);
            
        //     // ไล่เฉดแต่ละกลุ่ม
        //    const posScale = chroma
        //     .scale([ '#2E5427','green', '#a0b156']) // เขียวมะกอก → เขียวสด → เขียวเข้ม
        //     .mode('lab')

        //     const neuScale = chroma
        //     .scale(['#E4F02E', '#fdd835', '#7b5e36']) // เหลืองอ่อน → เหลืองทอง → น้ำตาลทอง
        //     .mode('lab')

        //     const negScale = chroma
        //     .scale([ '#4e0208','red', '#ffb347','#fdd835']) // ส้มอ่อน → แดงสด → แดงเข้มคล้ำ
        //         .mode('lab')
        //     // console.log('negScale ==== ',negScale.value);
        //     const assignColorByIndex = (group, scale) => {
        //         const total = group.length
        //         group.forEach((item, index) => {
        //         const t = total > 1 ? index / (total - 1) : 0.3 // ไล่จาก 0 → 1
        //         item.color = scale(t).hex()
        //         })
        //     }
        //      // ใส่สีแบบไม่ซ้ำตามลำดับ
        //     assignColorByIndex(positive, posScale)
        //     assignColorByIndex(neutral, neuScale)
        //     assignColorByIndex(negative, negScale)
        //     // ใส่สีให้กับแต่ละคำ
        //     // this.words.forEach(item => {
        //     //     let t = 0
        //     //     if (item.sentiment === 1) {
        //     //         t = item.count / maxPos
        //     //         item.color = posScale(t).hex()
        //     //     } else if (item.sentiment === 0) {
        //     //         t = item.count / maxNeu
        //     //         item.color = neuScale(t).hex()
        //     //     } else if (item.sentiment === -1) {
        //     //         t = item.count / maxNeg
        //     //         item.color = negScale(t).hex()
        //     //     } else {
        //     //         item.color = '#cccccc' // fallback สีเทา
        //     //     }
        //     // })
        //     // console.log("colored words === ", this.words);

        //     // รวมคำกลับมา (ออปชัน)
        //     // this.words = [...positive, ...neutral, ...negative]

        //     console.log("colored words === ", this.words)
        // },
        
        
    },
    
    mounted() {
        
        
    }
};
</script>

<style scoped>
.yellow {
  color: #8b5f3d;
}
.word-cloud-container {
    height: 100%;
    width: 100%;
    max-width: 100%;
    /* overflow: auto; */
    padding: 10px;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
}
/* svg text {
  font-family: 'Sarabun', sans-serif !important;
  font-weight: 100 !important;
} */
</style>
