<template>
  <section class="gai" :class="{ running: isRunning }">
    <div class="gai-inner">
      <!-- ตัวอย่างโพสต์เล็ก ๆ เมื่อชี้ที่ชิป P1, P2 … -->
      <div v-if="peek" class="gai-peek" :style="peek.style" @mouseenter="keepPeek" @mouseleave="hidePeek">
        <a :href="peek.p.url_post || null" target="_blank" rel="noopener" class="gai-peek-card">
          <div v-if="peekImg" class="gai-peek-media">
            <img :src="peekImg" alt="" referrerpolicy="no-referrer" @error="$set(imgFail, peekImg, true)" />
            <span class="gai-img-cap">
              <i v-if="platformIcon(peek.p.platform)" :class="platformIcon(peek.p.platform)"></i>
              <span class="text-truncate">{{ peek.p.account_name }}</span>
            </span>
          </div>
          <div v-else class="gai-peek-head">
            <span class="gai-peek-av">
              <img v-if="peek.p.profile_image && !imgFail[peek.p.profile_image]" :src="peek.p.profile_image" alt="" referrerpolicy="no-referrer" @error="$set(imgFail, peek.p.profile_image, true)" />
              <span v-else>{{ (peek.p.account_name || "?").slice(0, 1) }}</span>
            </span>
            <span class="gai-peek-name text-truncate">
              <i v-if="platformIcon(peek.p.platform)" :class="platformIcon(peek.p.platform)"></i> {{ peek.p.account_name || peek.p.platform }}
            </span>
          </div>
          <div class="gai-peek-body">
            <div class="gai-peek-text">{{ peek.p.title || peek.p.text || "(ไม่มีข้อความ)" }}</div>
            <div class="gai-peek-meta">
              <span>{{ postTime(peek.p.date) }}</span>
              <span><i class="fas fa-chart-line"></i> {{ compact(peek.p.engagement) }}</span>
              <span class="gai-chip" :class="'stm-' + peek.p.sentiment">{{ sentimentText[peek.p.sentiment] }}</span>
              <span v-if="peek.p.url_post" class="gai-peek-open">เปิดโพสต์ <i class="fas fa-external-link-alt"></i></span>
            </div>
          </div>
        </a>
      </div>

      <!-- ================= Header ================= -->
      <header class="gai-head">
        <div class="gai-brand">
          <span class="gai-spark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <defs>
                <linearGradient id="gaiGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#4285f4" /><stop offset=".55" stop-color="#9b72cb" /><stop offset="1" stop-color="#d96570" />
                </linearGradient>
              </defs>
              <path fill="url(#gaiGrad)" d="M10 2l1.6 4.6L16 8l-4.4 1.4L10 14l-1.6-4.6L4 8l4.4-1.4z" />
              <path fill="url(#gaiGrad)" d="M18 12l.9 2.6 2.6.9-2.6.9L18 19l-.9-2.6-2.6-.9 2.6-.9z" />
              <path fill="url(#gaiGrad)" d="M6 15l.6 1.6 1.6.6-1.6.6L6 19.4l-.6-1.6-1.6-.6 1.6-.6z" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="gai-title">AI Insight</div>
            <div class="gai-sub">
              <span class="gai-sub-item"><i class="far fa-folder"></i> {{ domainName || "-" }}</span>
              <span class="gai-sub-item"><i class="far fa-calendar"></i> {{ dateLabel }}<span v-if="dayCount > 1"> · {{ dayCount }} วัน</span></span>
              <span class="gai-sub-item" v-if="sourceLabel"><i class="fas fa-share-alt"></i> {{ sourceLabel }}</span>
              <!-- <span class="gai-sub-item"><i class="fas fa-fire-alt"></i> Top 100 โพสต์ตาม Engagement</span> -->
            </div>
          </div>
        </div>

        <div class="gai-actions">
          <div v-if="showExportButtons && result" class="gai-export" role="group" aria-label="ส่งออกรายงาน AI Insight" :aria-busy="exporting">
            <span class="gai-export-label"><i class="fas fa-download"></i> รายงาน</span>
            <button class="gai-export-btn pdf" :disabled="isRunning || exporting" @click="exportReport('pdf')" title="เปิดหน้าพิมพ์เพื่อบันทึกเป็น PDF">
              <i class="far fa-file-pdf"></i> PDF
            </button>
            <button class="gai-export-btn word" :disabled="isRunning || exporting" @click="exportReport('word')" title="ดาวน์โหลดรายงาน Word (.docx)">
              <span v-if="exporting" class="gai-btn-spin"></span><i v-else class="far fa-file-word"></i> Word
            </button>
          </div>
          <button v-if="analysis" class="gai-icon-btn" @click="copySummary" v-b-tooltip.hover title="คัดลอกสรุป">
            <i :class="copied ? 'fas fa-check' : 'far fa-copy'"></i>
          </button>
          <button v-if="result" class="gai-icon-btn" @click="collapsed = !collapsed" v-b-tooltip.hover :title="collapsed ? 'แสดงผล' : 'ย่อ'">
            <i :class="collapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
          </button>
          <button class="gai-btn" :disabled="isRunning" @click="analyze(!!result)">
            <span v-if="isRunning" class="gai-btn-spin"></span>
            <i v-else :class="result ? 'fas fa-redo-alt' : 'fas fa-magic'"></i>
            {{ isRunning ? "กำลังวิเคราะห์" : result ? "วิเคราะห์ใหม่" : "วิเคราะห์ด้วย AI" }}
          </button>
        </div>
      </header>

      <!-- ================= Intro ================= -->
      <div v-if="!result && !isRunning && !errorText" class="gai-intro">
        <div class="gai-intro-grid">
          <div v-for="f in features" :key="f.t" class="gai-feature">
            <i :class="f.i"></i>
            <div>
              <b>{{ f.t }}</b>
              <small>{{ f.d }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= Loading ================= -->
      <div v-if="isRunning" class="gai-loading">
        <div class="gai-steps">
          <div v-for="(s, i) in steps" :key="s.key" class="gai-step" :class="stepState(s.key)">
            <span class="gai-step-dot">
              <i v-if="stepState(s.key) === 'done'" class="fas fa-check"></i>
              <span v-else>{{ i + 1 }}</span>
            </span>
            <span>{{ s.label }}</span>
          </div>
        </div>
        <div class="gai-shimmer">
          <div class="l w90"></div><div class="l w70"></div><div class="l w80"></div><div class="l w40"></div>
        </div>
        <small class="gai-muted">{{ stageText || "กำลังเตรียมข้อมูล" }} · {{ elapsedSec }} วินาที</small>
      </div>

      <!-- ================= Error ================= -->
      <div v-if="errorText" class="gai-error">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorText }}</span>
        <button class="gai-link ml-auto" @click="errorText = ''">ปิด</button>
      </div>

      <!-- ================= Result ================= -->
      <div v-if="result && !collapsed && !isRunning" class="gai-result">
        <div v-if="result.message" class="gai-note warn"><i class="fas fa-info-circle"></i> {{ result.message }}</div>
        <div v-if="stale" class="gai-note"><i class="fas fa-sync-alt"></i> เงื่อนไข (วันที่/แพลตฟอร์ม) เปลี่ยนไปแล้ว ผลด้านล่างเป็นของเงื่อนไขเดิม — กด "วิเคราะห์ใหม่" เพื่ออัปเดต</div>

        <!-- Hero -->
        <div v-if="analysis" class="gai-hero" :class="{ 'has-media': heroImgs.length }">
          <div class="gai-hero-text">
            <div class="gai-chips">
              <span class="gai-chip lvl" :class="'lvl-' + analysis.situation_level.level">
                <span class="pulse"></span>{{ situationText[analysis.situation_level.level] }}
              </span>
              <span class="gai-chip" :class="'stm-' + analysis.overall_sentiment.label">กระแส{{ sentimentText[analysis.overall_sentiment.label] }}</span>
              <span v-if="multiDay" class="gai-chip soft"><i class="fas fa-chart-line"></i> วิเคราะห์ {{ daily.length }} ช่วงวัน</span>
              <span v-if="analysis.storylines.length" class="gai-chip soft"><i class="fas fa-stream"></i> {{ analysis.storylines.length }} เรื่องสืบเนื่อง</span>
              <span v-if="savedAt" class="gai-chip soft" v-b-tooltip.hover title="ผลล่าสุดของ Domain นี้ที่บันทึกไว้ในเครื่อง กด &quot;วิเคราะห์ใหม่&quot; เพื่ออัปเดต">
                <i class="far fa-clock"></i> วิเคราะห์เมื่อ{{ fromNow(savedAt) === "สักครู่" ? "" : " " }}{{ fromNow(savedAt) }}
              </span>
            </div>
            <h3 class="gai-headline">{{ analysis.headline }}</h3>
            <p class="gai-summary">{{ analysis.executive_summary }}</p>
            <div class="gai-reasons">
              <div v-if="analysis.situation_level.reason"><span>ระดับสถานการณ์</span>{{ analysis.situation_level.reason }}</div>
              <div v-if="analysis.overall_sentiment.reason"><span>เหตุผลกระแส</span>{{ analysis.overall_sentiment.reason }}</div>
            </div>
          </div>

          <!-- รูปประกอบพาดหัว (รูปจริงจากโพสต์ที่เกี่ยวข้อง) -->
          <div v-if="heroImgs.length" class="gai-mosaic" :class="'n' + Math.min(heroImgs.length, 3)">
            <a
              v-for="(img, k) in heroImgs.slice(0, 3)"
              :key="img.url"
              :href="img.url_post || img.url"
              target="_blank"
              rel="noopener"
              class="gai-tile-img"
              :class="{ big: k === 0 }"
              :title="img.caption"
            >
              <img :src="img.url" :alt="img.caption" referrerpolicy="no-referrer" loading="lazy" @error="$set(imgFail, img.url, true)" />
              <span class="gai-img-cap">
                <i v-if="platformIcon(img.platform)" :class="platformIcon(img.platform)"></i>
                <span class="text-truncate">{{ img.account_name }}</span>
              </span>
              <span v-if="k === 2 && heroImgs.length > 3" class="gai-img-more">+{{ heroImgs.length - 3 }}</span>
            </a>
          </div>
        </div>

        <!-- Tabs -->
        <nav class="gai-tabs" v-if="analysis">
          <button v-for="t in tabs" :key="t.key" class="gai-tab" :class="{ active: tab === t.key }" @click="tab = t.key">
            <i :class="t.icon"></i> {{ t.label }}
            <span v-if="t.count" class="gai-tab-count">{{ t.count }}</span>
          </button>
        </nav>

        <!-- ===== TAB: Overview ===== -->
        <div v-show="tab === 'overview' || !analysis">
          <div class="gai-tiles">
            <div class="gai-tile">
              <div class="gai-tile-ico blue"><i class="far fa-file-alt"></i></div>
              <div><div class="gai-tile-val">{{ fmt(ov.total_posts) }}</div><div class="gai-tile-lbl">โพสต์ทั้งหมด</div></div>
            </div>
            <div
              class="gai-tile gai-tile-senti"
              :class="'v-' + verdict(ov.net_sentiment_score).tone"
              tabindex="0"
            >
              <i class="fas fa-info-circle gai-tile-info"></i>
              <!-- คำอธิบาย Net Sentiment (แสดงเมื่อ hover / focus) -->
              <div class="gai-explain" role="tooltip">
                <div class="gai-explain-title"><i class="fas fa-info-circle"></i> Net Sentiment คืออะไร</div>
                <p>ตัวเลขที่บอกว่าความเห็นโดยรวม<b>เอนไปทางบวกหรือลบ</b> และมากแค่ไหน มีค่าตั้งแต่ <b>−100</b> (ลบทั้งหมด) ถึง <b>+100</b> (บวกทั้งหมด)</p>
                <div class="gai-explain-formula">
                  <span>(บวก − ลบ) ÷ ทั้งหมด × 100</span>
                  <small>
                    ({{ fmt(ov.sentiment.positive) }} − {{ fmt(ov.sentiment.negative) }}) ÷
                    {{ fmt(ov.sentiment.positive + ov.sentiment.neutral + ov.sentiment.negative) }} × 100 =
                    <b :class="scoreClass(ov.net_sentiment_score)">{{ signed(ov.net_sentiment_score) }}</b>
                  </small>
                </div>
                <div class="gai-explain-scale">
                  <div :class="{ on: verdict(ov.net_sentiment_score).tone === 'pos' }"><i class="dot pos"></i><b>+15 ขึ้นไป</b> เชิงบวก</div>
                  <div :class="{ on: verdict(ov.net_sentiment_score).tone === 'neu' }"><i class="dot neu"></i><b>−15 ถึง +15</b> เป็นกลาง</div>
                  <div :class="{ on: verdict(ov.net_sentiment_score).tone === 'neg' }"><i class="dot neg"></i><b>−15 ลงไป</b> เชิงลบ</div>
                </div>
                <small class="gai-explain-note">ความเห็นกลางนับรวมในตัวหาร ถ้ากลางมาก ค่าจะเข้าใกล้ 0 · คิดจาก sentiment ของโพสต์ทั้งหมดใน Domain</small>
              </div>
              <div class="gai-tile-ico gai-verdict-ico"><i :class="verdict(ov.net_sentiment_score).icon"></i></div>
              <div class="gai-tile-main">
                <div class="gai-tile-top">
                  <span class="gai-tile-val" :class="scoreClass(ov.net_sentiment_score)">{{ signed(ov.net_sentiment_score) }}</span>
                  <span class="gai-tile-verdict">{{ verdict(ov.net_sentiment_score).label }}</span>
                </div>
                <div class="gai-sbar xs">
                  <div class="pos" :style="{ width: ov.sentiment_percent.positive + '%' }"></div>
                  <div class="neu" :style="{ width: ov.sentiment_percent.neutral + '%' }"></div>
                  <div class="neg" :style="{ width: ov.sentiment_percent.negative + '%' }"></div>
                </div>
                <div class="gai-tile-pcts">
                  <span class="c-pos">บวก {{ ov.sentiment_percent.positive }}%</span>
                  <span class="c-neu">กลาง {{ ov.sentiment_percent.neutral }}%</span>
                  <span class="c-neg">ลบ {{ ov.sentiment_percent.negative }}%</span>
                </div>
              </div>
            </div>
            <div class="gai-tile">
              <div class="gai-tile-ico pink"><i class="fas fa-chart-line"></i></div>
              <div>
                <div class="gai-tile-val">{{ compact(ov.engagement.total) }}</div>
                <div class="gai-tile-lbl">Engagement รวม<span v-if="ov.engagement.views"> · {{ compact(ov.engagement.views) }} views</span></div>
              </div>
            </div>
            <div class="gai-tile">
              <div class="gai-tile-ico teal"><i class="fas fa-users"></i></div>
              <div>
                <div class="gai-tile-val">{{ compact(ov.accounts) }}</div>
                <div class="gai-tile-lbl">บัญชีที่โพสต์<span v-if="ov.user_comments"> · {{ compact(ov.user_comments) }} ผู้คอมเมนต์</span></div>
              </div>
            </div>
          </div>

          <div class="gai-src-note">
            <i class="fas fa-database"></i>
            <template v-if="result.overview">สถิติภาพรวมทั้งหมดของ Domain<span v-if="sourceLabel"> (รวมทุกแพลตฟอร์ม)</span></template>
            <template v-else>ดึงสถิติภาพรวมไม่สำเร็จ — แสดงจากโพสต์ที่วิเคราะห์แทน</template>
            · AI อ่านเนื้อหาจาก {{ (result.posts || []).length }} โพสต์ที่ engagement สูงสุด
          </div>

          <div class="gai-panel gai-kw-panel" v-if="analysis && analysis.keywords.length">
            <span class="gai-kw-lbl"><i class="fas fa-hashtag"></i> คำสำคัญ</span>
            <span v-for="k in analysis.keywords" :key="'k' + k" class="gai-kw">{{ k }}</span>
          </div>

          <!-- Trend chart (multi-day) -->
          <div class="gai-panel" v-if="multiDay">
            <div class="gai-panel-title d-flex align-items-center">
              แนวโน้มรายวัน
              <span class="gai-legend ml-auto mb-0">
                <span><i class="dot grad"></i>จำนวนโพสต์</span>
                <span><i class="line"></i>Net sentiment</span>
              </span>
            </div>
            <div class="gai-chart-wrap">
              <svg :viewBox="`0 0 ${chart.w} ${chart.h}`" class="gai-chart" :style="{ minWidth: Math.min(chart.w, daily.length * 44) + 'px' }">
                <defs>
                  <linearGradient id="gaiBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#7b8cf5" /><stop offset="1" stop-color="#c3cdfb" />
                  </linearGradient>
                  <linearGradient id="gaiLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#4285f4" /><stop offset=".5" stop-color="#9b72cb" /><stop offset="1" stop-color="#d96570" />
                  </linearGradient>
                </defs>
                <text :x="chart.pl" :y="chart.lineTop - 8" class="band">Net sentiment</text>
                <line :x1="chart.pl" :x2="chart.w - chart.pr" :y1="chart.zeroY" :y2="chart.zeroY" class="zero" />
                <text :x="chart.pl" :y="chart.barTop - 10" class="band">จำนวนโพสต์</text>
                <g v-for="b in chart.bars" :key="b.key">
                  <rect :x="b.x" :y="b.y" :width="b.bw" :height="b.bh" rx="5" fill="url(#gaiBar)">
                    <title>{{ b.label }}: {{ fmt(b.count) }} โพสต์ · net {{ signed(b.net) }}</title>
                  </rect>
                  <text :x="b.cx" :y="b.y - 5" class="val">{{ compact(b.count) }}</text>
                  <text :x="b.cx" :y="chart.h - 6" class="axis">{{ b.short }}</text>
                </g>
                <polyline :points="chart.line" fill="none" stroke="url(#gaiLine)" stroke-width="2.5" stroke-linejoin="round" />
                <g v-for="b in chart.bars" :key="'c' + b.key">
                  <circle :cx="b.cx" :cy="b.ly" r="5" class="pt" :class="scoreClass(b.net)" />
                  <text :x="b.cx" :y="b.ly - 9" class="net" :class="scoreClass(b.net)">{{ signed(b.net) }}</text>
                </g>
              </svg>
            </div>
            <p v-if="analysis && analysis.trend_overview" class="gai-trend-text"><i class="fas fa-magic"></i>{{ analysis.trend_overview }}</p>
          </div>

          <!-- ประเด็นหลัก (อยู่หน้าแรก) -->
          <section v-if="analysis" class="gai-section">
            <div class="gai-section-head">
              <h4><i class="fas fa-layer-group"></i> ประเด็นหลัก <span class="gai-tab-count">{{ analysis.key_themes.length }}</span></h4>
              <small class="gai-muted">ความเห็นบวก/ลบ และมุมมองสองฝั่งของแต่ละประเด็น</small>
            </div>
            <div v-if="!analysis.key_themes.length" class="gai-empty">ไม่พบประเด็นที่ชัดเจน</div>
            <div class="gai-issues">
              <article v-for="(t, i) in analysis.key_themes" :key="'t' + i" class="gai-issue">
                <header class="gai-issue-head">
                  <span class="gai-issue-no">{{ i + 1 }}</span>
                  <div class="min-w-0 flex-grow-1">
                    <h4 class="gai-issue-title">
                      {{ t.title }}
                      <span class="gai-trend" :class="'tr-' + t.trend"><i :class="trendIcon[t.trend]"></i> {{ trendText[t.trend] }}</span>
                    </h4>
                    <p class="gai-issue-desc">{{ t.description }}</p>
                  </div>
                  <div class="gai-issue-share" v-b-tooltip.hover title="สัดส่วนจากโพสต์ที่วิเคราะห์">{{ t.share_percent }}%</div>
                </header>

                <!-- ความเห็นบวก/ลบ: แถบบาง + ตัวเลขในบรรทัดเดียว -->
                <!-- ความเห็นบวก/ลบ: แถวโพสต์ + แถวคอมเมนต์ทั้งหมด -->
                <div class="gai-stm-rows" v-if="(t.stats && t.stats.posts) || hasCmt(t)">
                  <div class="gai-verdict" :class="'v-' + themeVerdict(t).tone">
                    <span class="gai-verdict-ico"><i :class="themeVerdict(t).icon"></i></span>
                    <div class="gai-verdict-txt">
                      <b>{{ themeVerdict(t).label }}</b>
                      <small>{{ themeVerdict(t).src }}</small>
                    </div>
                    <div class="gai-meter sm">
                      <div class="gai-meter-track"></div>
                      <span class="gai-meter-mark" :style="{ left: meterPos(themeVerdict(t).net) }"></span>
                    </div>
                  </div>
                  <div v-if="themeSplit(t)" class="gai-split">
                    <i class="fas fa-exchange-alt"></i> โพสต์{{ themeSplit(t).post }} แต่คอมเมนต์{{ themeSplit(t).cmt }}
                  </div>
                  <div v-if="t.stats && t.stats.posts" class="gai-stm-row">
                    <span class="gai-stm-lbl"><i class="far fa-file-alt"></i> โพสต์ <b>{{ fmt(t.stats.posts) }}</b></span>
                    <div class="gai-sbar xs">
                      <div class="pos" :style="{ width: t.stats.sentiment_percent.positive + '%' }"></div>
                      <div class="neu" :style="{ width: t.stats.sentiment_percent.neutral + '%' }"></div>
                      <div class="neg" :style="{ width: t.stats.sentiment_percent.negative + '%' }"></div>
                    </div>
                    <span class="gai-stm-pct">
                      <b class="c-pos">{{ Math.round(t.stats.sentiment_percent.positive) }}%</b>
                      <b class="c-neu">{{ Math.round(t.stats.sentiment_percent.neutral) }}%</b>
                      <b class="c-neg">{{ Math.round(t.stats.sentiment_percent.negative) }}%</b>
                    </span>
                  </div>
                  <div v-if="hasCmt(t)" class="gai-stm-row">
                    <span class="gai-stm-lbl"><i class="far fa-comments"></i> คอมเมนต์ <b>{{ fmt(cmtRelevant(t)) }}</b></span>
                    <div class="gai-sbar xs">
                      <div class="pos" :style="{ width: t.comment_analysis.percent.positive + '%' }"></div>
                      <div class="neu" :style="{ width: t.comment_analysis.percent.neutral + '%' }"></div>
                      <div class="neg" :style="{ width: t.comment_analysis.percent.negative + '%' }"></div>
                    </div>
                    <span class="gai-stm-pct">
                      <b class="c-pos">{{ Math.round(t.comment_analysis.percent.positive) }}%</b>
                      <b class="c-neu">{{ Math.round(t.comment_analysis.percent.neutral) }}%</b>
                      <b class="c-neg">{{ Math.round(t.comment_analysis.percent.negative) }}%</b>
                    </span>
                  </div>
                  <div class="gai-stm-meta">
                    <span><i class="dot pos"></i>บวก <i class="dot neu"></i>กลาง <i class="dot neg"></i>ลบ</span>
                    <span v-if="t.stats && t.stats.posts"><i class="fas fa-chart-line"></i> {{ compact(t.stats.engagement) }}</span>
                    <span v-if="hasCmt(t)" v-b-tooltip.hover :title="cmtNote(t)">
                      <i class="fas fa-info-circle"></i> อ่าน {{ fmt(t.comment_analysis.labeled) }} คอมเมนต์<template v-if="t.comment_analysis.counts.off_topic"> (ไม่เกี่ยว {{ fmt(t.comment_analysis.counts.off_topic) }})</template>
                    </span>
                    <span v-if="hasCmt(t)" class="ml-auto">net คอมเมนต์ <b :class="scoreClass(t.comment_analysis.net_score)">{{ signed(t.comment_analysis.net_score) }}</b></span>
                  </div>
                </div>

                <p v-if="t.debate_summary" class="gai-debate"><i class="fas fa-comments"></i>{{ t.debate_summary }}</p>

                <!-- มุมมองสองฝั่งจากรอบแรก: ซ่อนเมื่อมีข้อโต้แย้งจากคอมเมนต์ทั้งหมดแล้ว (กันข้อมูลขัดกัน) -->
                <ul v-if="(t.supporting.length || t.opposing.length) && !(hasCmt(t) && t.comment_analysis.arguments.length)" class="gai-views">
                  <li v-for="(n, k) in t.supporting" :key="'s' + k" class="pos">
                    <i class="fas fa-plus-circle"></i><span>{{ n.point }} <RefChips :refs="n.post_refs" :map="postMap" inline /></span>
                  </li>
                  <li v-for="(n, k) in t.opposing" :key="'o' + k" class="neg">
                    <i class="fas fa-minus-circle"></i><span>{{ n.point }} <RefChips :refs="n.post_refs" :map="postMap" inline /></span>
                  </li>
                </ul>

                <!-- เสียงจากคอมเมนต์ทั้งหมด: ข้อโต้แย้งหลัก + จำนวน + คอมเมนต์ตัวอย่างจริง -->
                <div v-if="hasCmt(t) && t.comment_analysis.arguments.length" class="gai-cmts">
                  <div class="gai-cmts-title">
                    <i class="far fa-comment-dots"></i> เสียงจากคอมเมนต์ <span class="gai-muted">(AI อ่าน {{ fmt(t.comment_analysis.labeled) }} คอมเมนต์)</span>
                    <span v-if="dominantSide(t) !== 'neutral'" class="gai-dom" :class="'st-' + dominantSide(t)">
                      <i :class="dominantSide(t) === 'negative' ? 'fas fa-minus-circle' : 'fas fa-plus-circle'"></i>
                      {{ dominantSide(t) === "negative" ? "ฝั่งลบมากกว่า" : "ฝั่งบวกมากกว่า" }} 
                    </span>
                  </div>
                  <div v-for="(g, gi) in (openCmts[i] ? sortedArgs(t) : sortedArgs(t).slice(0, 2))" :key="'g' + gi" class="gai-arg" :class="'st-' + g.side">
                    <div class="gai-arg-head">
                      <i :class="g.side === 'positive' ? 'fas fa-plus-circle' : 'fas fa-minus-circle'"></i>
                      <span class="gai-arg-point">{{ g.point }}</span>
                      <span class="gai-arg-count" v-b-tooltip.hover title="จำนวนคอมเมนต์ที่พูดเรื่องนี้ (ประมาณการโดย AI)">{{ fmt(g.count) }} คอมเมนต์</span>
                    </div>
                    <div v-for="c in g.examples" :key="c.id" class="gai-cmt mini">
                      <a :href="c.profile_url || null" target="_blank" rel="noopener" class="gai-cmt-av" :title="c.author">
                        <img v-if="c.photo && !imgFail[c.photo]" :src="c.photo" :alt="c.author" referrerpolicy="no-referrer" loading="lazy" @error="$set(imgFail, c.photo, true)" />
                        <span v-else>{{ (c.author || "?").replace(/^@/, "").slice(0, 1) }}</span>
                      </a>
                      <div class="gai-cmt-body">
                        <div class="gai-cmt-head">
                          <a v-if="c.profile_url" :href="c.profile_url" target="_blank" rel="noopener" class="gai-cmt-name">{{ c.author || "ผู้ใช้" }}</a>
                          <b v-else class="gai-cmt-name">{{ c.author || "ผู้ใช้" }}</b>
                          <a :href="c.post.url_post || null" target="_blank" rel="noopener" class="gai-cmt-from">
                            · <i class="far fa-file-alt"></i> <i v-if="platformIcon(c.post.platform)" :class="platformIcon(c.post.platform)"></i> {{ c.post.account_name }}
                          </a>
                        </div>
                        <div class="gai-cmt-text">“{{ c.text }}”</div>
                      </div>
                    </div>
                  </div>
                  <button v-if="t.comment_analysis.arguments.length > 2" class="gai-more" @click="$set(openCmts, i, !openCmts[i])">
                    {{ openCmts[i] ? "ย่อ" : "ดูข้อโต้แย้งเพิ่ม (" + (t.comment_analysis.arguments.length - 2) + ")" }}
                    <i :class="openCmts[i] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>

                <!-- ความเห็นตัวอย่าง (กรณีไม่มีผลวิเคราะห์คอมเมนต์ทั้งหมด) -->
                <div v-else-if="t.sample_comments && t.sample_comments.length" class="gai-cmts">
                  <div class="gai-cmts-title"><i class="far fa-comment-dots"></i> ความเห็นตัวอย่างที่ AI ใช้วิเคราะห์</div>
                  <div v-for="c in (openCmts[i] ? sortedSamples(t) : sortedSamples(t).slice(0, 2))" :key="c.id" class="gai-cmt" :class="'st-' + c.stance">
                    <a :href="c.profile_url || null" target="_blank" rel="noopener" class="gai-cmt-av" :title="c.author">
                      <img v-if="c.photo && !imgFail[c.photo]" :src="c.photo" :alt="c.author" referrerpolicy="no-referrer" loading="lazy" @error="$set(imgFail, c.photo, true)" />
                      <span v-else>{{ (c.author || "?").replace(/^@/, "").slice(0, 1) }}</span>
                    </a>
                    <div class="gai-cmt-body">
                      <div class="gai-cmt-head">
                        <a v-if="c.profile_url" :href="c.profile_url" target="_blank" rel="noopener" class="gai-cmt-name">{{ c.author || "ผู้ใช้" }}</a>
                        <b v-else class="gai-cmt-name">{{ c.author || "ผู้ใช้" }}</b>
                        <span class="gai-chip" :class="'stm-' + c.stance">{{ sentimentText[c.stance] }}</span>
                      </div>
                      <div class="gai-cmt-text">“{{ c.text }}”</div>
                      <div v-if="c.why" class="gai-cmt-why"><i class="fas fa-magic"></i>{{ c.why }}</div>
                      <div class="gai-cmt-src">
                        จากโพสต์
                        <a :href="c.post.url_post || null" target="_blank" rel="noopener" :title="c.post.title">
                          <i v-if="platformIcon(c.post.platform)" :class="platformIcon(c.post.platform)"></i> {{ c.post.account_name || c.post.platform }}
                          <i v-if="c.post.url_post" class="fas fa-external-link-alt"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <button v-if="t.sample_comments.length > 2" class="gai-more" @click="$set(openCmts, i, !openCmts[i])">
                    {{ openCmts[i] ? "ย่อ" : "ดูความเห็นเพิ่ม (" + (t.sample_comments.length - 2) + ")" }}
                    <i :class="openCmts[i] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>

                <!-- โพสต์ตัวอย่าง: แสดงเป็นกรอบเล็ก ๆ ทันที (ไม่ต้องชี้) -->
                <footer class="gai-issue-foot" v-if="t.post_refs.length">
                  <span class="gai-issue-foot-lbl">โพสต์ตัวอย่าง</span>
                  <PostMinis :refs="t.post_refs" :map="postMap" />
                </footer>
              </article>
            </div>
            <div v-if="analysis.audience_reaction" class="gai-callout">
              <i class="far fa-comments"></i>
              <div><b>ปฏิกิริยาผู้ชมโดยรวม</b><span>{{ analysis.audience_reaction }}</span></div>
            </div>
          </section>
        </div>

        <!-- ===== TAB: Evolution (daily + storylines) ===== -->
        <div v-if="analysis" v-show="tab === 'evolution'">
          <div class="gai-panel" v-if="analysis.storylines.length">
            <div class="gai-panel-title">เรื่องที่สืบเนื่องกัน <small class="gai-muted ml-1">การเคลื่อนไหวของข่าวเดียวกันตามเวลา</small></div>
            <div v-for="(s, i) in analysis.storylines" :key="'st' + i" class="gai-story">
              <div class="gai-story-head">
                <span class="gai-status" :class="'st-' + s.status"><i :class="storyIcon[s.status]"></i> {{ storyText[s.status] }}</span>
                <b class="gai-story-title">{{ s.title }}</b>
                <span class="gai-muted small ml-auto" v-if="s.first_seen">{{ s.first_seen }}<span v-if="s.last_seen && s.last_seen !== s.first_seen"> → {{ s.last_seen }}</span></span>
              </div>
              <p class="mb-2">{{ s.summary }}</p>
              <div v-if="s.change_summary" class="gai-change"><i class="fas fa-exchange-alt"></i><div><b>สิ่งที่เปลี่ยนไป</b> {{ s.change_summary }}</div></div>
              <ol class="gai-tl" v-if="s.timeline.length">
                <li v-for="(t, j) in s.timeline" :key="'tl' + j">
                  <span class="gai-tl-when">{{ t.when }}</span>
                  <div class="gai-tl-body">{{ t.development }}</div>
                  <PostMinis :refs="t.post_refs" :map="postMap" />
                </li>
              </ol>
            </div>
          </div>

          <div class="gai-panel" v-if="multiDay">
            <div class="gai-panel-title">การเปลี่ยนแปลงรายวัน</div>
            <div v-for="d in dailyMerged" :key="'d' + d.key" class="gai-day">
              <div class="gai-day-date">
                <b>{{ d.short }}</b>
                <small>{{ d.weekday }}</small>
                <span class="gai-mom" :class="'m-' + (d.ai ? d.ai.momentum : 'stable')" v-b-tooltip.hover :title="momentumText[d.ai ? d.ai.momentum : 'stable']">
                  <i :class="momentumIcon[d.ai ? d.ai.momentum : 'stable']"></i>
                </span>
              </div>
              <div class="gai-day-body">
                <div class="gai-day-metrics">
                  <span class="gai-metric"><i class="far fa-file-alt"></i> {{ fmt(d.total_posts) }} โพสต์
                    <em v-if="d.change && d.change.posts_pct !== null" :class="d.change.posts_pct >= 0 ? 'up' : 'down'">{{ d.change.posts_pct >= 0 ? "▲" : "▼" }} {{ Math.abs(d.change.posts_pct) }}%</em>
                  </span>
                  <span class="gai-metric"><i class="fas fa-balance-scale"></i> net <b :class="scoreClass(d.net_sentiment_score)">{{ signed(d.net_sentiment_score) }}</b>
                    <em v-if="d.change" :class="d.change.net_sentiment > 0 ? 'better' : d.change.net_sentiment < 0 ? 'worse' : ''">{{ signed(d.change.net_sentiment) }}</em>
                  </span>
                  <span v-if="d.ai" class="gai-metric" :class="'sh-' + d.ai.sentiment_shift">{{ shiftText[d.ai.sentiment_shift] }}</span>
                  <div class="gai-mini-sbar" v-if="d.total_posts">
                    <div class="pos" :style="{ width: d.sentiment_percent.positive + '%' }"></div>
                    <div class="neu" :style="{ width: d.sentiment_percent.neutral + '%' }"></div>
                    <div class="neg" :style="{ width: d.sentiment_percent.negative + '%' }"></div>
                  </div>
                </div>
                <template v-if="d.ai">
                  <div class="gai-day-head">{{ d.ai.headline }}</div>
                  <div class="gai-day-sum">{{ d.ai.summary }}</div>
                  <div v-if="d.ai.new_topics.length" class="mt-1">
                    <span v-for="t in d.ai.new_topics" :key="t" class="gai-kw new"><i class="fas fa-plus"></i> {{ t }}</span>
                  </div>
                  <PostMinis :refs="d.ai.post_refs" :map="postMap" />
                </template>
                <div v-else class="gai-muted small">{{ d.total_posts ? "ไม่มีความเปลี่ยนแปลงสำคัญ" : "ไม่มีโพสต์ในวันนี้" }}</div>
              </div>
            </div>
          </div>
          <div v-if="!analysis.storylines.length && !multiDay" class="gai-empty">ไม่พบเรื่องที่สืบเนื่องกันในข้อมูลชุดนี้ — ลองเลือกช่วงหลายวันเพื่อดูการเปลี่ยนแปลง</div>
        </div>

        <!-- ===== TAB: Risks ===== -->
        <div v-if="analysis" v-show="tab === 'risks'">
          <div class="gai-panel">
            <div class="gai-panel-title">ความเสี่ยง</div>
            <div v-if="!analysis.risks.length" class="gai-muted small">ไม่พบความเสี่ยงที่ชัดเจน</div>
            <div v-for="(r, i) in sortedRisks" :key="'r' + i" class="gai-risk" :class="'lv-' + r.level">
              <div><span class="gai-tag" :class="'lv-' + r.level">{{ levelText[r.level] }}</span><b>{{ r.title }}</b></div>
              <div class="small mt-1">{{ r.description }}</div>
              <PostMinis :refs="r.post_refs" :map="postMap" />
            </div>
          </div>
          <div class="gai-panel">
            <div class="gai-panel-title"><i class="fas fa-search"></i> ข้อมูลที่ควรตรวจสอบ</div>
            <div v-if="!analysis.misinformation_signals.length" class="gai-muted small">ไม่พบสัญญาณที่น่าสงสัย</div>
            <div v-for="(m, i) in analysis.misinformation_signals" :key="'m' + i" class="gai-li">
              <b>“{{ m.claim }}”</b><div class="small gai-muted">{{ m.reason }}</div>
              <PostMinis :refs="m.post_refs" :map="postMap" />
            </div>
          </div>
        </div>

        <!-- ===== TAB: Actions (ข้อเสนอแนะ + โอกาส) ===== -->
        <div v-if="analysis" v-show="tab === 'actions'">
          <div class="gai-section-head mt-3">
            <h4><i class="fas fa-tasks"></i> ข้อเสนอแนะ</h4>
            <span v-for="lv in ['high', 'medium', 'low']" :key="lv" v-show="recoCount[lv]" class="gai-tag" :class="'lv-' + lv">{{ priorityText[lv] }} {{ recoCount[lv] }}</span>
          </div>
          <div v-if="!analysis.recommendations.length" class="gai-empty">ไม่มีข้อเสนอแนะ</div>
          <div class="gai-recos">
            <article v-for="(r, i) in sortedRecos" :key="'rc' + i" class="gai-reco-card" :class="'lv-' + r.priority">
              <div class="gai-reco-top">
                <span class="gai-reco-no">{{ i + 1 }}</span>
                <span class="gai-tag" :class="'lv-' + r.priority">{{ priorityText[r.priority] }}</span>
              </div>
              <div class="gai-reco-action">{{ r.action }}</div>
              <div class="gai-reco-why" v-if="r.rationale"><i class="fas fa-info-circle"></i>{{ r.rationale }}</div>
            </article>
          </div>

          <template v-if="analysis.opportunities.length">
            <div class="gai-section-head mt-4">
              <h4><i class="far fa-lightbulb"></i> โอกาสในการสื่อสาร</h4>
            </div>
            <div class="gai-recos">
              <article v-for="(o, i) in analysis.opportunities" :key="'op' + i" class="gai-reco-card opp">
                <div class="gai-reco-action">{{ o.title }}</div>
                <div class="gai-reco-why">{{ o.description }}</div>
                <PostMinis :refs="o.post_refs" :map="postMap" />
              </article>
            </div>
          </template>
        </div>

        <!-- ===== TAB: Influencers ===== -->
        <div v-if="analysis" v-show="tab === 'people'">
          <div class="gai-grid2">
            <div v-if="!analysis.influencers.length" class="gai-empty">ไม่พบผู้มีอิทธิพลที่ชัดเจน</div>
            <div v-for="(x, i) in analysis.influencers" :key="'i' + i" class="gai-person">
              <a :href="x.account_url || null" target="_blank" rel="noopener" class="gai-avatar-wrap">
                <img
                  v-if="x.profile_image && !imgFail[x.profile_image]"
                  :src="x.profile_image"
                  :alt="x.account_name"
                  class="gai-avatar img"
                  referrerpolicy="no-referrer"
                  loading="lazy"
                  @error="$set(imgFail, x.profile_image, true)"
                />
                <span v-else class="gai-avatar">{{ (x.account_name || "?").slice(0, 1) }}</span>
                <i v-if="platformIcon(x.platform)" :class="['gai-pf', platformIcon(x.platform)]"></i>
              </a>
              <div class="min-w-0 flex-grow-1">
                <div class="d-flex align-items-center">
                  <a v-if="x.account_url" :href="x.account_url" target="_blank" rel="noopener" class="gai-acc text-truncate">{{ x.account_name }}</a>
                  <b v-else class="text-truncate">{{ x.account_name }}</b>
                  <span class="gai-chip ml-auto" :class="'stm-' + x.stance">{{ sentimentText[x.stance] }}</span>
                </div>
                <small class="gai-muted">{{ x.platform }} · {{ x.role }}</small>
                <div class="small mt-1">{{ x.note }}</div>
                <PostMinis :refs="x.post_refs" :map="postMap" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!analysis && result.raw_text" class="gai-panel"><pre class="gai-raw">{{ result.raw_text }}</pre></div>

        <footer class="gai-foot">
          <span>
            <b>ข้อจำกัด:</b> ข้อมูลครอบคลุมเฉพาะโพสต์ที่มี engagement สูงสุด อาจไม่สะท้อนภาพรวมของความคิดเห็นจากบัญชีขนาดเล็กหรือกลุ่มปิด
            · {{ fmtDate(result.generated_at) }} · AI อาจผิดพลาด ควรตรวจสอบกับโพสต์ต้นฉบับ
          </span>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import DomainAiService, { errorMessage } from "@/common/domainAi.service";
import { buildInsightReport, downloadInsightWord, printInsightPdf } from "@/common/domainAiReport";

// ชิปอ้างอิงโพสต์ (P1, P2 …) — hover ดูข้อความ, คลิกเปิดโพสต์ต้นฉบับในแท็บใหม่
const RefChips = {
  name: "RefChips",
  props: { refs: { type: Array, default: () => [] }, map: { type: Object, default: () => ({}) }, inline: Boolean },
  render(h) {
    if (!this.refs || !this.refs.length) return h("span");
    return h(
      this.inline ? "span" : "div",
      { class: this.inline ? "gai-refs inline" : "gai-refs" },
      this.refs.map((r) => {
        const p = this.map[r] || {};
        const host = this.$parent;
        return h(
          "a",
          {
            key: r,
            class: ["gai-ref", "stm-" + (p.sentiment || "neutral")],
            attrs: { "aria-label": [p.account_name, p.platform].filter(Boolean).join(" · "), href: p.url_post || null, target: "_blank", rel: "noopener" },
            on: {
              click: (e) => {
                if (!p.url_post) e.preventDefault();
              },
              // ชี้ที่ชิป -> แสดงตัวอย่างโพสต์เล็ก ๆ
              mouseenter: (e) => host && host.showPeek && p.ref && host.showPeek(p, e.currentTarget),
              mouseleave: () => host && host.hidePeek && host.hidePeek(),
            },
          },
          // แสดงชื่อบัญชีแทนรหัส P
          [h("i", { class: "fas fa-link" }), " " + ((p.account_name || p.platform || "โพสต์").length > 18 ? (p.account_name || p.platform).slice(0, 17) + "…" : p.account_name || p.platform || "โพสต์")]
        );
      })
    );
  },
};

// กรอบตัวอย่างโพสต์เล็ก ๆ (ใช้ทุกแท็บ) — รูปปก/โปรไฟล์ + ชื่อบัญชี + รหัส P + ข้อความ 2 บรรทัด
const PostMinis = {
  name: "PostMinis",
  props: { refs: { type: Array, default: () => [] }, map: { type: Object, default: () => ({}) }, max: { type: Number, default: 3 } },
  render(h) {
    const host = this.$parent;
    const refs = (this.refs || []).filter((r) => this.map[r]).slice(0, this.max);
    if (!refs.length || !host) return h("span");
    const fail = host.imgFail || {};
    const markFail = (u) => host.$set(host.imgFail, u, true);
    return h(
      "div",
      { class: "gai-minis" },
      refs.map((r) => {
        const p = this.map[r];
        const icon = host.platformIcon(p.platform);
        const img = (p.images || []).find((u) => u && !fail[u]) || "";
        const kids = [];
        if (img) {
          kids.push(
            h("div", { class: "gai-mini-media" }, [
              h("img", { attrs: { src: img, alt: "", referrerpolicy: "no-referrer", loading: "lazy" }, on: { error: () => markFail(img) } }),
              h("span", { class: "gai-img-cap" }, [
                icon ? h("i", { class: icon }) : null,
                h("span", { class: "text-truncate" }, p.account_name),
              ]),
            ])
          );
        } else {
          const avImg = p.profile_image && !fail[p.profile_image] ? p.profile_image : "";
          kids.push(
            h("div", { class: "gai-mini-head" }, [
              h("span", { class: "gai-peek-av sm" }, [
                avImg
                  ? h("img", { attrs: { src: avImg, alt: "", referrerpolicy: "no-referrer" }, on: { error: () => markFail(avImg) } })
                  : h("span", (p.account_name || "?").slice(0, 1)),
              ]),
              h("span", { class: "text-truncate gai-mini-name" }, [icon ? h("i", { class: icon }) : null, " " + (p.account_name || p.platform || "")]),
            ])
          );
        }
        kids.push(h("div", { class: "gai-mini-text" }, p.title || p.text));
        kids.push(
          h("div", { class: "gai-mini-meta" }, [
            h("span", (host.postTime(p.date) || "").slice(0, 10)),
            h("span", [h("i", { class: "fas fa-chart-line" }), " " + host.compact(p.engagement)]),
          ])
        );
        return h(
          "a",
          {
            key: r,
            class: ["gai-mini", "stm-" + (p.sentiment || "neutral")],
            attrs: { href: p.url_post || null, target: "_blank", rel: "noopener", title: p.title || p.text },
          },
          kids
        );
      })
    );
  },
};

// ---- เก็บผลล่าสุดของแต่ละ Domain ใน localStorage (รีเฟรชแล้วไม่หาย, กดวิเคราะห์ใหม่ = แทนที่) ----
const STORE_KEY = "aion.domainAi.v1";
const MAX_DOMAINS = 20;

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" ? obj : {};
  } catch (e) {
    return {};
  }
}

function writeStore(obj) {
  // เต็มโควตา -> ลบ Domain ที่เก่าสุดทีละตัวแล้วลองใหม่
  const ids = Object.keys(obj).sort((a, b) => (obj[a].savedAt || 0) - (obj[b].savedAt || 0));
  while (ids.length > MAX_DOMAINS) delete obj[ids.shift()];
  for (;;) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(obj));
      return true;
    } catch (e) {
      if (ids.length <= 1) return false;
      delete obj[ids.shift()];
    }
  }
}

function storeId(domainId) {
  // ผูกกับผู้ใช้ด้วย กันคนอื่นที่ล็อกอินเครื่องเดียวกันเห็นผลของกัน
  const user = (typeof localStorage !== "undefined" && localStorage.getItem("username")) || "";
  return user + "::" + String(domainId);
}

export default {
  name: "DomainAiAnalysis",
  components: { RefChips, PostMinis },
  data() {
    return {
      isRunning: false,
      exporting: false,
      showExportButtons: false,
      stage: "",
      stageText: "",
      startedAt: 0,
      now: Date.now(),
      timer: null,
      pollTimer: null,
      result: null,
      resultKey: "",
      errorText: "",
      collapsed: false,
      imgFail: {},
      openCmts: {},
      peek: null,
      peekTimer: null,
      savedAt: 0,
      copied: false,
      tab: "overview",
      steps: [
        { key: "fetching", label: "ดึงโพสต์" },
        { key: "analyzing", label: "AI วิเคราะห์" },
        { key: "comments", label: "อ่านคอมเมนต์" },
        { key: "finalizing", label: "สรุปผล" },
      ],
      features: [
        { i: "fas fa-align-left", t: "สรุปสถานการณ์", d: "พาดหัว + สรุปผู้บริหาร + ระดับสถานการณ์" },
        { i: "fas fa-chart-line", t: "การเปลี่ยนแปลงรายวัน", d: "เลือกหลายวัน เห็นแนวโน้มและสิ่งที่เปลี่ยน" },
        { i: "fas fa-stream", t: "ข่าวที่สืบเนื่องกัน", d: "ติดตามการเคลื่อนไหวของเรื่องเดียวกันตามเวลา" },
        { i: "fas fa-shield-alt", t: "ความเสี่ยง & ข่าวลือ", d: "พร้อมข้อเสนอแนะและโพสต์อ้างอิง" },
      ],
      sentimentText: { positive: "เชิงบวก", neutral: "เป็นกลาง", negative: "เชิงลบ", mixed: "ผสม" },
      levelText: { high: "สูง", medium: "กลาง", low: "ต่ำ" },
      priorityText: { high: "เร่งด่วน", medium: "ควรทำ", low: "พิจารณา" },
      situationText: { normal: "ปกติ", watch: "เฝ้าระวัง", alert: "แจ้งเตือน", critical: "วิกฤต" },
      storyText: { new: "เรื่องใหม่", developing: "กำลังพัฒนา", escalating: "ร้อนแรงขึ้น", "de-escalating": "เริ่มคลี่คลาย", resolved: "จบแล้ว", recurring: "วนกลับมา" },
      storyIcon: { new: "fas fa-star", developing: "fas fa-spinner", escalating: "fas fa-arrow-up", "de-escalating": "fas fa-arrow-down", resolved: "fas fa-check", recurring: "fas fa-redo" },
      momentumText: { rising: "กำลังเพิ่มขึ้น", falling: "ลดลง", stable: "ทรงตัว", peak: "จุดพีค" },
      momentumIcon: { rising: "fas fa-arrow-up", falling: "fas fa-arrow-down", stable: "fas fa-minus", peak: "fas fa-mountain" },
      shiftText: { better: "กระแสดีขึ้น", worse: "กระแสแย่ลง", stable: "กระแสทรงตัว" },
      trendText: { up: "เพิ่มขึ้น", down: "ลดลง", flat: "ทรงตัว", new: "ใหม่" },
      trendIcon: { up: "fas fa-arrow-up", down: "fas fa-arrow-down", flat: "fas fa-minus", new: "fas fa-star" },
    };
  },
  computed: {
    ...mapGetters(["getClickDomain", "getClickDomainId", "getSdateDm", "getEdateDm", "getNamePlatform", "getSourceNews"]),
    domainName() {
      return this.getClickDomain;
    },
    startDate() {
      return this.getSdateDm || moment().format("YYYY-MM-DD") + "T00:00:00";
    },
    endDate() {
      return this.getEdateDm || moment().format("YYYY-MM-DD") + "T23:59:59";
    },
    dateLabel() {
      const s = this.startDate.slice(0, 10);
      const e = this.endDate.slice(0, 10);
      return s === e ? s : s + " – " + e;
    },
    dayCount() {
      return moment(this.endDate.slice(0, 10)).diff(moment(this.startDate.slice(0, 10)), "days") + 1;
    },
    sourceLabel() {
      return this.getNamePlatform ? String(this.getNamePlatform) : "";
    },
    payload() {
      const p = {
        domain: this.getClickDomainId,
        domain_name: this.getClickDomain,
        start_date: this.startDate,
        end_date: this.endDate,
        source_news: this.getSourceNews || "all",
      };
      if (this.getNamePlatform) p.source = this.getNamePlatform;
      return p;
    },
    payloadKey() {
      const { domain, start_date, end_date, source, source_news } = this.payload;
      return JSON.stringify({ domain, start_date, end_date, source, source_news });
    },
    stale() {
      return !!this.result && this.resultKey !== this.payloadKey;
    },
    analysis() {
      return this.result && this.result.analysis;
    },
    stats() {
      return (this.result && this.result.stats) || {};
    },
    // สถิติภาพรวมจริงของ Domain (getStatistics); fallback = สถิติจากโพสต์ที่วิเคราะห์
    ov() {
      const o = this.result && this.result.overview;
      if (o) return o;
      const s = this.stats;
      return {
        total_posts: this.result ? this.result.total_available : 0,
        accounts: (s.top_accounts || []).length,
        user_comments: 0,
        engagement: s.engagement || { total: 0, views: 0 },
        sentiment: s.sentiment || { positive: 0, neutral: 0, negative: 0 },
        sentiment_percent: s.sentiment_percent || { positive: 0, neutral: 0, negative: 0 },
        net_sentiment_score: s.net_sentiment_score || 0,
      };
    },
    daily() {
      return (this.result && this.result.daily) || [];
    },
    multiDay() {
      return this.daily.length > 1;
    },
    dailyMerged() {
      const ai = (this.analysis && this.analysis.daily_changes) || [];
      return this.daily.map((d) => {
        const match = ai.find((x) => x.date && (x.date === d.key || x.date.indexOf(d.key) === 0 || d.label.indexOf(x.date) === 0));
        return {
          ...d,
          ai: match || null,
          short: d.from === d.to ? moment(d.from).format("DD MMM") : moment(d.from).format("DD MMM") + "–" + moment(d.to).format("DD MMM"),
          weekday: d.from === d.to ? moment(d.from).format("ddd") : "",
        };
      });
    },
    chart() {
      const n = this.daily.length;
      const w = Math.max(1200, n * 80);
      const h = 250;
      const pl = 20, pr = 20, pb = 24;
      const lineTop = 34, lineH = 50; // แถบ net sentiment ด้านบน
      const barTop = lineTop + lineH + 40; // แถบแท่งจำนวนโพสต์ด้านล่าง
      const barH = h - barTop - pb;
      const slot = (w - pl - pr) / Math.max(n, 1);
      const bw = Math.min(44, slot * 0.55);
      const max = Math.max(1, ...this.daily.map((d) => d.total_posts));
      const lineY = (v) => lineTop + ((100 - Math.max(-100, Math.min(100, v))) / 200) * lineH;
      const bars = this.daily.map((d, i) => {
        const bh = Math.max(3, (d.total_posts / max) * barH);
        const cx = pl + slot * i + slot / 2;
        return {
          key: d.key,
          label: d.label,
          count: d.total_posts,
          net: d.net_sentiment_score,
          cx,
          x: cx - bw / 2,
          bw,
          bh,
          y: barTop + barH - bh,
          ly: lineY(d.total_posts ? d.net_sentiment_score : 0),
          short: moment(d.from).format(n > 14 ? "D/M" : "DD MMM"),
        };
      });
      return { w, h, pl, pr, bars, lineTop, barTop, zeroY: lineY(0), line: bars.map((b) => `${b.cx},${b.ly}`).join(" ") };
    },
    tabs() {
      const a = this.analysis || {};
      const t = [{ key: "overview", label: "ภาพรวม", icon: "fas fa-th-large" }];
      t.push({ key: "evolution", label: this.multiDay ? "การเคลื่อนไหว & รายวัน" : "การเคลื่อนไหว", icon: "fas fa-stream", count: (a.storylines || []).length });
      t.push({ key: "risks", label: "ความเสี่ยง", icon: "fas fa-shield-alt", count: (a.risks || []).length });
      t.push({ key: "actions", label: "ข้อเสนอแนะ", icon: "fas fa-tasks", count: (a.recommendations || []).length });
      t.push({ key: "people", label: "ผู้มีอิทธิพล", icon: "fas fa-user-friends" });
      return t;
    },
    // ใช้ใน template ของโพสต์ตัวอย่าง
    peekImg() {
      const imgs = (this.peek && this.peek.p.images) || [];
      return imgs.find((u) => u && !this.imgFail[u]) || "";
    },
    heroImgs() {
      const list = (this.analysis && this.analysis.hero_images) || [];
      return list.filter((x) => x && x.url && !this.imgFail[x.url]);
    },
    postMap() {
      const m = {};
      ((this.result && this.result.posts) || []).forEach((p) => (m[p.ref] = p));
      return m;
    },
    sortedRisks() {
      const o = { high: 0, medium: 1, low: 2 };
      return [...this.analysis.risks].sort((a, b) => o[a.level] - o[b.level]);
    },
    recoCount() {
      const c = { high: 0, medium: 0, low: 0 };
      ((this.analysis && this.analysis.recommendations) || []).forEach((r) => (c[r.priority] = (c[r.priority] || 0) + 1));
      return c;
    },
    sortedRecos() {
      const o = { high: 0, medium: 1, low: 2 };
      return [...this.analysis.recommendations].sort((a, b) => o[a.priority] - o[b.priority]);
    },
    elapsedSec() {
      return this.startedAt ? Math.round((this.now - this.startedAt) / 1000) : 0;
    },
  },
  watch: {
    getClickDomainId() {
      this.stopPolling();
      this.isRunning = false;
      this.errorText = "";
      this.loadSaved();
    },
  },
  created() {
    this.loadSaved();
  },
  methods: {
    async exportReport(format) {
      if (!this.result || this.isRunning || this.exporting) return;
      this.exporting = true;
      try {
        const blocks = buildInsightReport({ result: this.result, resultKey: this.resultKey, domainName: this.domainName, savedAt: this.savedAt, overview: this.ov });
        const name = String(this.domainName || 'Domain').replace(/[<>:"/\\|?*]/g, '_').slice(0, 80);
        const filename = `AI-Insight_${name}_${moment().format('YYYYMMDD-HHmmss')}`;
        if (format === 'pdf') printInsightPdf(blocks, filename);
        else await downloadInsightWord(blocks, filename);
      } catch (e) {
        this.errorText = e.message || 'ไม่สามารถส่งออกรายงานได้ กรุณาลองใหม่';
      } finally {
        this.exporting = false;
      }
    },
    fmt(n) {
      return Number(n || 0).toLocaleString("th-TH");
    },
    compact(n) {
      n = Number(n || 0);
      if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
      return String(n);
    },
    signed(n) {
      n = Number(n || 0);
      return (n > 0 ? "+" : "") + n;
    },
    scoreClass(n) {
      return n > 10 ? "c-pos" : n < -10 ? "c-neg" : "c-neu";
    },
    fmtDate(d) {
      return d ? moment(d).format("DD/MM/YYYY HH:mm") : "-";
    },
    stepState(key) {
      const order = ["queued", "fetching", "analyzing", "comments", "finalizing", "done"];
      const cur = order.indexOf(this.stage);
      const me = order.indexOf(key);
      if (cur > me) return "done";
      if (cur === me) return "active";
      return "";
    },
    async analyze(force) {
      if (!this.getClickDomainId) {
        this.errorText = "ไม่พบ Domain ที่เลือก";
        return;
      }
      this.stopPolling();
      this.errorText = "";
      this.isRunning = true;
      this.collapsed = false;
      this.stage = "queued";
      this.stageText = "ส่งคำขอ";
      this.startedAt = Date.now();
      this.timer = setInterval(() => (this.now = Date.now()), 1000);
      const key = this.payloadKey;
      try {
        const job = await DomainAiService.submit({ ...this.payload, force: !!force });
        this.handleJob(job, key);
      } catch (err) {
        this.fail(errorMessage(err));
      }
    },
    handleJob(job, key) {
      this.stage = job.stage || job.status;
      this.stageText = job.stage_text || "";
      if (job.status === "done") {
        this.result = { ...job.result, cachedAt: job.cached ? job.updated_at : null };
        this.imgFail = {};
        this.openCmts = {};
        this.saveResult(key);
        this.resultKey = key;
        this.tab = "overview";
        this.finish();
      } else if (job.status === "error") {
        this.fail((job.error && job.error.message) || "AI วิเคราะห์ไม่สำเร็จ");
      } else {
        if (Date.now() - this.startedAt > 12 * 60 * 1000) return this.fail("ใช้เวลานานเกินไป กรุณาลองใหม่");
        this.pollTimer = setTimeout(async () => {
          try {
            const j = await DomainAiService.getJob(job.job_id);
            this.handleJob(j, key);
          } catch (err) {
            this.fail(errorMessage(err));
          }
        }, 2500);
      }
    },
    finish() {
      this.isRunning = false;
      this.stopPolling();
    },
    fail(msg) {
      this.errorText = msg;
      this.finish();
    },
    stopPolling() {
      clearTimeout(this.pollTimer);
      clearInterval(this.timer);
      this.pollTimer = null;
      this.timer = null;
    },
    loadSaved() {
      this.result = null;
      this.resultKey = "";
      this.savedAt = 0;
      this.tab = "overview";
      if (!this.getClickDomainId) return;
      const entry = readStore()[storeId(this.getClickDomainId)];
      if (!entry || !entry.result) return;
      this.result = entry.result;
      this.resultKey = entry.key || "";
      this.savedAt = entry.savedAt || 0;
      this.imgFail = {};
      this.openCmts = {};
    },
    saveResult(key) {
      if (!this.result || !this.result.analysis || !this.getClickDomainId) return;
      const store = readStore();
      const now = Date.now();
      store[storeId(this.getClickDomainId)] = { result: this.result, key, savedAt: now };
      if (writeStore(store)) this.savedAt = now;
    },
    fromNow(ts) {
      const diff = Math.max(0, Date.now() - ts) / 1000;
      if (diff < 60) return "สักครู่";
      if (diff < 3600) return Math.floor(diff / 60) + " นาทีที่แล้ว";
      if (diff < 86400) return Math.floor(diff / 3600) + " ชม. ที่แล้ว";
      return moment(ts).format("DD/MM/YYYY HH:mm");
    },
    showPeek(p, el) {
      clearTimeout(this.peekTimer);
      if (!el || !el.getBoundingClientRect) return;
      const r = el.getBoundingClientRect();
      const W = 260;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const left = Math.max(8, Math.min(r.left + r.width / 2 - W / 2, vw - W - 8));
      const above = r.top > 300;
      const style = { left: left + "px", width: W + "px" };
      if (above) style.bottom = vh - r.top + 8 + "px";
      else style.top = r.bottom + 8 + "px";
      this.peek = { p, style };
    },
    keepPeek() {
      clearTimeout(this.peekTimer);
    },
    hidePeek() {
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => (this.peek = null), 180);
    },
    postTime(d) {
      // date ของ AION เก็บเป็นเวลาไทยแล้ว -> แสดงตามค่าที่เก็บ
      const m = d ? moment.utc(d) : null;
      return m && m.isValid() ? m.format("DD/MM/YYYY HH:mm") : "";
    },
    // ป้ายสรุปทิศทางความเห็นแบบดูแล้วรู้ (net = บวก − ลบ, ช่วง -100..100)
    verdict(net) {
      // 3 ระดับ: บวก (≥ +15) / กลาง (−15 ถึง +15) / ลบ (≤ −15)
      const n = Number(net) || 0;
      if (n >= 15) return { tone: "pos", label: "เชิงบวก", icon: "fas fa-face-smile" };
      if (n <= -15) return { tone: "neg", label: "เชิงลบ", icon: "fas fa-face-frown" };
      return { tone: "neu", label: "เป็นกลาง", icon: "fas fa-face-meh" };
    },
    meterPos(net) {
      const n = Math.max(-100, Math.min(100, Number(net) || 0));
      return 50 + n / 2 + "%";
    },
    themeVerdict(t) {
      if (this.hasCmt(t)) {
        const c = t.comment_analysis;
        return { ...this.verdict(c.net_score, c.percent), net: c.net_score, src: "จาก " + this.fmt(this.cmtRelevant(t)) + " คอมเมนต์" };
      }
      const st = t.stats || {};
      return { ...this.verdict(st.net_sentiment_score, st.sentiment_percent), net: st.net_sentiment_score || 0, src: "จาก " + this.fmt(st.posts || 0) + " โพสต์" };
    },
    // โพสต์กับคอมเมนต์ไปคนละทิศชัดเจน -> แจ้งเตือน
    themeSplit(t) {
      if (!this.hasCmt(t) || !t.stats || !t.stats.posts) return null;
      const pn = t.stats.net_sentiment_score || 0;
      const cn = t.comment_analysis.net_score || 0;
      const dir = (n) => (n >= 15 ? "pos" : n <= -15 ? "neg" : "neu");
      if (dir(pn) === dir(cn) || dir(pn) === "neu" || dir(cn) === "neu") return null;
      const word = { pos: "เป็นเชิงบวก", neg: "เป็นเชิงลบ" };
      return { post: word[dir(pn)], cmt: word[dir(cn)] };
    },
    // ฝั่งที่มีความเห็นมากกว่าในประเด็น: ใช้สัดส่วนจากคอมเมนต์ทั้งหมดก่อน ถ้าไม่มีใช้สัดส่วนโพสต์
    dominantSide(t) {
      const p = (this.hasCmt(t) && t.comment_analysis.percent) || (t.stats && t.stats.posts && t.stats.sentiment_percent) || null;
      if (!p) return "neutral";
      if (p.negative > p.positive) return "negative";
      if (p.positive > p.negative) return "positive";
      return "neutral";
    },
    // ข้อโต้แย้ง: ฝั่งที่มากกว่าขึ้นก่อน แล้วเรียงตามจำนวนคอมเมนต์
    sortedArgs(t) {
      const dom = this.dominantSide(t);
      return [...((t.comment_analysis && t.comment_analysis.arguments) || [])].sort((a, b) => {
        const ra = a.side === dom ? 0 : 1;
        const rb = b.side === dom ? 0 : 1;
        return ra - rb || (b.count || 0) - (a.count || 0);
      });
    },
    // คอมเมนต์ตัวอย่าง (กรณีไม่มีผลคอมเมนต์ทั้งหมด): ฝั่งที่มากกว่าขึ้นก่อน -> เป็นกลาง -> ฝั่งตรงข้าม
    sortedSamples(t) {
      const dom = this.dominantSide(t);
      const rank = (st) => (st === dom ? 0 : st === "neutral" ? 1 : 2);
      return [...(t.sample_comments || [])].sort((a, b) => rank(a.stance) - rank(b.stance));
    },
    hasCmt(t) {
      const c = t && t.comment_analysis;
      return !!(c && c.labeled && c.counts);
    },
    cmtRelevant(t) {
      const c = t.comment_analysis.counts;
      return c.positive + c.neutral + c.negative;
    },
    cmtNote(t) {
      const c = t.comment_analysis;
      const parts = [`AI อ่านและติดป้าย ${this.fmt(c.labeled)} คอมเมนต์`];
      if (c.capped) parts.push(`(จากที่ระบบเก็บไว้ ${this.fmt(c.total_available)} รายการ — เกินเพดานจึงเลือกกระจายทุกโพสต์)`);
      if (c.reported_count) parts.push(`แพลตฟอร์มแจ้งยอดคอมเมนต์ ${this.fmt(c.reported_count)}`);
      if (c.counts.off_topic) parts.push(`ไม่เกี่ยวกับประเด็น/สแปม ${this.fmt(c.counts.off_topic)} (ไม่นับในสัดส่วน)`);
      if (c.partial) parts.push("บางชุดวิเคราะห์ไม่สำเร็จ");
      return parts.join(" · ");
    },
    platformIcon(pf) {
      const k = String(pf || "").toLowerCase();
      if (k.includes("facebook")) return "fab fa-facebook pf-fb";
      if (k.includes("tiktok")) return "fab fa-tiktok pf-tt";
      if (k.includes("youtube")) return "fab fa-youtube pf-yt";
      if (k.includes("twitter") || k === "x") return "fab fa-x-twitter pf-x";
      if (k.includes("instagram")) return "fab fa-instagram pf-ig";
      if (k.includes("news")) return "far fa-newspaper pf-news";
      return "";
    },
    async copySummary() {
      const a = this.analysis;
      if (!a) return;
      const lines = [
        `[AI Insight] ${this.domainName} (${this.dateLabel})`,
        a.headline,
        "",
        a.executive_summary,
      ];
      if (a.trend_overview) lines.push("", "แนวโน้ม: " + a.trend_overview);
      if (a.daily_changes.length) {
        lines.push("", "การเปลี่ยนแปลงรายวัน:");
        a.daily_changes.forEach((d) => lines.push(`- ${d.date}: ${d.headline} — ${d.summary}`));
      }
      if (a.storylines.length) {
        lines.push("", "เรื่องที่สืบเนื่อง:");
        a.storylines.forEach((s) => lines.push(`- [${this.storyText[s.status]}] ${s.title}: ${s.change_summary || s.summary}`));
      }
      lines.push("", "ประเด็นหลัก:");
      a.key_themes.forEach((t, i) => {
        const st = t.stats && t.stats.posts ? ` [บวก ${t.stats.sentiment_percent.positive}% / ลบ ${t.stats.sentiment_percent.negative}%]` : "";
        lines.push(`${i + 1}. ${t.title} (${t.share_percent}%)${st} - ${t.description}`);
        t.supporting.forEach((n) => lines.push(`   + ${n.point}`));
        t.opposing.forEach((n) => lines.push(`   - ${n.point}`));
        if (t.comment_analysis && t.comment_analysis.labeled) {
          const c = t.comment_analysis;
          lines.push(`   คอมเมนต์ ${c.labeled}: บวก ${c.percent.positive}% / กลาง ${c.percent.neutral}% / ลบ ${c.percent.negative}%`);
          (c.arguments || []).forEach((g) => lines.push(`   ${g.side === "positive" ? "+" : "-"} ${g.point} (${g.count} คอมเมนต์)`));
        }
        (t.sample_comments || []).slice(0, 2).forEach((c) => lines.push(`   💬 ${c.author || "ผู้ใช้"}: "${c.text}" (จากโพสต์ของ ${c.post.account_name})`));
      });
      lines.push("", "ความเสี่ยง:", ...a.risks.map((r) => `- [${this.levelText[r.level]}] ${r.title}: ${r.description}`));
      lines.push("", "ข้อเสนอแนะ:", ...this.sortedRecos.map((r, i) => `${i + 1}. ${r.action}`));
      const text = lines.join("\n");
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    },
  },
  mounted() {
    this._onScrollPeek = () => (this.peek = null);
    window.addEventListener("scroll", this._onScrollPeek, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this._onScrollPeek, true);
    clearTimeout(this.peekTimer);
    this.stopPolling();
  },
};
</script>

<style scoped>
.gai {
  --g-blue: #4285f4;
  --g-purple: #9b72cb;
  --g-pink: #d96570;
  --g-grad: linear-gradient(90deg, #4285f4 0%, #9b72cb 55%, #d96570 100%);
  --g-soft: linear-gradient(135deg, #eef3fe 0%, #f4effb 55%, #fdf0f2 100%);
  --ink: #1f1f1f;
  --ink-2: #5f6368;
  --line: #e8eaed;
  --surface: #f8fafd;
  --pos: #1e8e3e;
  --neu: #9aa0a6;
  --neg: #d93025;
  position: relative;
  border-radius: 22px;
  padding: 1.5px;
  background: var(--line);
  text-align: left;
  color: var(--ink);
}
.gai.running {
  background: linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #9b72cb, #4285f4);
  background-size: 300% 100%;
  animation: gai-flow 3s linear infinite;
  box-shadow: 0 8px 30px rgba(123, 116, 230, 0.18);
}
@keyframes gai-flow { to { background-position: 300% 0; } }
.gai-inner { background: #fff; border-radius: 21px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(60, 64, 67, 0.08); }
.min-w-0 { min-width: 0; }
.gai-muted { color: var(--ink-2); }

/* Header */
.gai-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }
.gai-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.gai-spark { width: 44px; height: 44px; flex: none; border-radius: 14px; background: var(--g-soft); display: inline-flex; align-items: center; justify-content: center; }
.running .gai-spark svg { animation: gai-twinkle 1.6s ease-in-out infinite; }
@keyframes gai-twinkle { 50% { transform: scale(0.85) rotate(20deg); } }
.gai-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.2px; background: var(--g-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gai-sub { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 0.85rem; color: var(--ink-2); }
.gai-sub-item i { margin-right: 4px; opacity: 0.7; }
.gai-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.gai-btn {
  border: 0; border-radius: 999px; padding: 10px 22px; font-weight: 600; color: #fff; cursor: pointer;
  background: linear-gradient(90deg, #4285f4, #7b6fd6 60%, #9b72cb); box-shadow: 0 4px 14px rgba(66, 133, 244, 0.3);
  transition: transform 0.15s, box-shadow 0.2s, filter 0.2s; display: inline-flex; align-items: center; gap: 8px;
}
.gai-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(123, 111, 214, 0.38); filter: brightness(1.05); }
.gai-btn:disabled { opacity: 0.85; cursor: progress; }
.gai-btn-spin { width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.45); border-top-color: #fff; border-radius: 50%; animation: gai-rot 0.8s linear infinite; }
@keyframes gai-rot { to { transform: rotate(360deg); } }
.gai-icon-btn { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: #fff; color: var(--ink-2); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s; flex: none; }
.gai-icon-btn:hover { background: var(--surface); color: var(--g-blue); }
.gai-export { display: inline-flex; align-items: center; gap: 4px; padding: 4px; background: #f7f8fc; border: 1px solid #e4e7ef; border-radius: 14px; }
.gai-export-label { padding: 0 8px; color: #778196; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
.gai-export-label i { margin-right: 5px; }
.gai-export-btn { display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent; height: 34px; min-width: 76px; padding: 0 12px; gap: 7px; border-radius: 10px; background: white; font-size: 0.84rem; font-weight: 600; cursor: pointer; box-shadow: 0 1px 3px #2029390c; transition: background .15s, border-color .15s; }
.gai-export-btn.pdf { color: #b64151; }
.gai-export-btn.word { color: #305fa5; }
.gai-export-btn.pdf:hover:not(:disabled) { background: #fff1f3; border-color: #f3cbd2; }
.gai-export-btn.word:hover:not(:disabled) { background: #edf4ff; border-color: #c8dafa; }
.gai-export-btn:focus-visible { outline: 2px solid #7b6fd6; outline-offset: 2px; }
.gai-export-btn .gai-btn-spin { border-color: #c8dafa; border-top-color: #305fa5; }
.gai-export-btn:disabled { opacity: 0.5; cursor: wait; }
.gai-icon-btn.sm { width: 30px; height: 30px; font-size: 0.75rem; }
.gai-link { border: 0; background: none; color: inherit; text-decoration: underline; cursor: pointer; }

/* Intro */
.gai-intro { margin-top: 18px; }
.gai-intro-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
.gai-feature { display: flex; gap: 12px; align-items: flex-start; background: var(--surface); border-radius: 14px; padding: 12px 14px; }
.gai-feature i { color: var(--g-purple); margin-top: 3px; }
.gai-feature b { display: block; font-size: 0.9rem; }
.gai-feature small { color: var(--ink-2); }

/* Loading */
.gai-loading { margin-top: 18px; }
.gai-steps { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-bottom: 14px; }
.gai-step { display: flex; align-items: center; gap: 8px; color: #9aa0a6; font-size: 0.88rem; }
.gai-step-dot { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #dadce0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; }
.gai-step.active { color: var(--ink); font-weight: 600; }
.gai-step.active .gai-step-dot { border-color: transparent; background: var(--g-grad); color: #fff; animation: gai-pulse 1.4s infinite; }
.gai-step.done { color: var(--ink-2); }
.gai-step.done .gai-step-dot { background: #e6f4ea; border-color: #e6f4ea; color: var(--pos); }
@keyframes gai-pulse { 0% { box-shadow: 0 0 0 0 rgba(155, 114, 203, 0.45); } 70% { box-shadow: 0 0 0 8px rgba(155, 114, 203, 0); } }
.gai-shimmer .l { height: 12px; border-radius: 6px; margin-bottom: 10px; background: linear-gradient(90deg, #eef3fe 0%, #f4effb 30%, #fdf0f2 50%, #eef3fe 100%); background-size: 200% 100%; animation: gai-sh 1.6s linear infinite; }
.w90 { width: 90%; } .w80 { width: 80%; } .w70 { width: 70%; } .w40 { width: 40%; }
@keyframes gai-sh { to { background-position: -200% 0; } }

.gai-error { margin-top: 16px; display: flex; gap: 10px; align-items: center; background: #fce8e6; color: #a50e0e; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; }
.gai-note { margin-top: 12px; padding: 9px 14px; border-radius: 12px; background: #e8f0fe; color: #174ea6; font-size: 0.86rem; }
.gai-note.warn { background: #fef7e0; color: #8a5300; }
.gai-note i { margin-right: 6px; }

/* Hero */
.gai-result { margin-top: 16px; }
.gai-hero { background: var(--g-soft); border-radius: 18px; padding: 18px 20px; }
.gai-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.gai-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; padding: 4px 11px; border-radius: 999px; background: #fff; color: var(--ink-2); }
.gai-chip.soft { background: rgba(255, 255, 255, 0.7); font-weight: 500; }
.gai-chip.lvl .pulse { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.gai-chip.lvl-normal { color: var(--pos); }
.gai-chip.lvl-watch { color: #b06000; }
.gai-chip.lvl-alert { color: #e8710a; }
.gai-chip.lvl-critical { color: #fff; background: var(--neg); }
.gai-chip.lvl-alert .pulse, .gai-chip.lvl-critical .pulse { animation: gai-blink 1s infinite; }
@keyframes gai-blink { 50% { opacity: 0.2; } }
.gai-chip.stm-positive { color: var(--pos); background: #e6f4ea; }
.gai-chip.stm-neutral { color: #b06000; background: #fef7e0; }
.gai-chip.stm-negative { color: var(--neg); background: #fce8e6; }
.gai-chip.stm-mixed { color: #b06000; background: #fef7e0; }
.gai-headline { font-size: 1.3rem; font-weight: 700; line-height: 1.45; margin: 0 0 8px; color: var(--ink); }
.gai-summary { font-size: 0.97rem; line-height: 1.75; margin-bottom: 10px; color: #3c4043; }
.gai-reasons { display: grid; gap: 4px; font-size: 0.9rem; color: var(--ink-2); }
.gai-reasons span { font-weight: 600; color: var(--ink); margin-right: 8px; }

/* Hero media */
.gai-hero.has-media { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 42%); gap: 18px; align-items: stretch; }
.gai-mosaic { display: grid; gap: 6px; border-radius: 14px; overflow: hidden; min-height: 220px; }
.gai-mosaic.n1 { grid-template-columns: 1fr; }
.gai-mosaic.n2 { grid-template-columns: 1fr 1fr; }
.gai-mosaic.n3 { grid-template-columns: 1.6fr 1fr; grid-template-rows: 1fr 1fr; }
.gai-mosaic.n3 .big { grid-row: 1 / span 2; }
.gai-tile-img { position: relative; display: block; overflow: hidden; background: #e8eaed; min-height: 107px; }
.gai-tile-img img { width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; inset: 0; transition: transform 0.4s ease; }
.gai-tile-img:hover img { transform: scale(1.05); }
.gai-img-cap {
  position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: 6px;
  padding: 18px 10px 7px; font-size: 0.72rem; color: #fff; background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
}
.gai-img-cap b { margin-left: auto; font-size: 0.66rem; padding: 0 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.25); }
.gai-img-cap i { color: #fff !important; }
.gai-img-more { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; color: #fff; background: rgba(32, 33, 36, 0.45); }
@media (max-width: 992px) {
  .gai-hero.has-media { grid-template-columns: 1fr; }
  .gai-mosaic { min-height: 200px; }
}

/* ป้ายสั้น (บวก/กลาง/ลบ, ระดับ, สถานะ) ห้ามตัดบรรทัด และไม่ถูกบีบ */
.gai-chip, .gai-tag, .gai-trend, .gai-status, .gai-kw, .gai-metric em { white-space: nowrap; flex-shrink: 0; }
.gai-grid2 > *, .gai-person { min-width: 0; }
.gai-person .d-flex { gap: 8px; min-width: 0; }
.gai-person .d-flex > .text-truncate { min-width: 0; flex: 1 1 auto; }

/* ข้อความในผลวิเคราะห์ที่ใช้ .small / <small> ของ Bootstrap (80%) ให้ใหญ่ขึ้น */
.gai-result .small, .gai-result small { font-size: 0.92rem; }
.gai-result .gai-muted.small, .gai-result small.gai-muted { font-size: 0.86rem; }

/* Tabs */
.gai-tabs { display: flex; gap: 4px; overflow-x: auto; margin: 16px 0 4px; border-bottom: 1px solid var(--line); scrollbar-width: none; }
.gai-tabs::-webkit-scrollbar { display: none; }
.gai-tab { position: relative; border: 0; background: none; padding: 10px 14px; font-size: 0.88rem; color: var(--ink-2); white-space: nowrap; cursor: pointer; border-radius: 10px 10px 0 0; }
.gai-tab:hover { background: var(--surface); }
.gai-tab i { margin-right: 4px; font-size: 0.8rem; }
.gai-tab.active { color: var(--g-blue); font-weight: 600; }
.gai-tab.active::after { content: ""; position: absolute; left: 10px; right: 10px; bottom: -1px; height: 3px; border-radius: 3px 3px 0 0; background: var(--g-grad); }
.gai-tab-count { font-size: 0.7rem; background: #e8f0fe; color: var(--g-blue); border-radius: 999px; padding: 1px 7px; margin-left: 4px; }

/* Tiles & panels */
.gai-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; margin-top: 14px; }
.gai-tile { display: flex; gap: 12px; align-items: center; background: var(--surface); border-radius: 16px; padding: 14px; min-width: 0; }
.gai-tile > div:last-child { min-width: 0; }
.gai-tile-ico { width: 40px; height: 40px; flex: none; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
.gai-tile-ico.blue { background: #e8f0fe; color: var(--g-blue); }
.gai-tile-ico.purple { background: #f3e8fd; color: var(--g-purple); }
.gai-tile-ico.pink { background: #fce8ec; color: var(--g-pink); }
.gai-tile-ico.teal { background: #e4f7fb; color: #129eaf; }
.gai-tile-val { font-size: 1.45rem; font-weight: 700; line-height: 1.2; }
.gai-tile-lbl { font-size: 0.84rem; color: var(--ink-2); }
.c-pos { color: var(--pos); } .c-neg { color: var(--neg); } .c-neu { color: #e37400; }

.gai-panel { border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; margin-top: 12px; }
.gai-panel-title { font-weight: 600; font-size: 1rem; margin-bottom: 10px; }
.gai-panel-title i { margin-right: 6px; color: var(--g-purple); }
.gai-grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin-top: 12px; }

.gai-sbar, .gai-mini-sbar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; background: #f1f3f4; gap: 2px; }
.gai-mini-sbar { height: 6px; width: 120px; }
.gai-sbar .pos, .gai-mini-sbar .pos, .dot.pos, .bg-positive { background: #34a853; }
.gai-sbar .neu, .gai-mini-sbar .neu, .dot.neu, .bg-neutral { background: #fbbc04; }
.gai-sbar .neg, .gai-mini-sbar .neg, .dot.neg, .bg-negative { background: #ea4335; }
.bg-mixed { background: #fbbc04; }
.gai-legend { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 0.88rem; color: var(--ink-2); margin-top: 8px; font-weight: 400; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
.dot.grad { background: #9fadf8; border-radius: 3px; }
.gai-legend .line { display: inline-block; width: 16px; height: 3px; border-radius: 2px; background: var(--g-grad); margin-right: 6px; vertical-align: middle; }

/* Chart */
.gai-chart-wrap { overflow-x: auto; }
.gai-chart { width: 100%; height: auto; display: block; }
.gai-chart .band { font-size: 12px; fill: #9aa0a6; }
.gai-chart .net { font-size: 13px; font-weight: 600; text-anchor: middle; fill: var(--ink-2); }
.gai-chart .net.c-pos { fill: #1e8e3e; }
.gai-chart .net.c-neg { fill: #d93025; }
.gai-chart .zero { stroke: #dadce0; stroke-dasharray: 4 4; }
.gai-chart .val { font-size: 13px; font-weight: 600; fill: var(--ink-2); text-anchor: middle; }
.gai-chart .axis { font-size: 12.5px; fill: var(--ink-2); text-anchor: middle; }
.gai-chart .pt { stroke: #fff; stroke-width: 2; fill: var(--g-purple); }
.gai-chart .pt.c-pos { fill: #34a853; }
.gai-chart .pt.c-neg { fill: #ea4335; }
.gai-trend-text { margin: 10px 0 0; padding: 10px 14px; background: var(--g-soft); border-radius: 12px; font-size: 0.98rem; line-height: 1.65; }
.gai-trend-text i { margin-right: 6px; color: var(--g-purple); }

/* Reco & keywords */
.gai-num { width: 24px; height: 24px; flex: none; border-radius: 50%; background: var(--g-soft); color: var(--g-purple); font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.gai-tag { display: inline-block; font-size: 0.78rem; font-weight: 600; padding: 1px 8px; border-radius: 6px; margin-right: 8px; vertical-align: 1px; }
.gai-tag.lv-high { background: #fce8e6; color: var(--neg); }
.gai-tag.lv-medium { background: #fef7e0; color: #b06000; }
.gai-tag.lv-low { background: #f1f3f4; color: var(--ink-2); }
.gai-kw { display: inline-flex; align-items: center; gap: 4px; font-size: 0.9rem; padding: 4px 12px; border-radius: 999px; margin: 0 6px 6px 0; background: #f1f3f4; }
.gai-kw.hash { background: #e8f0fe; color: #174ea6; }
.gai-kw.new { background: #f3e8fd; color: #7b3fbf; font-size: 0.82rem; padding: 2px 10px; }
.gai-kw b { font-weight: 600; opacity: 0.7; }

/* Storylines */
.gai-story { border-radius: 14px; background: var(--surface); padding: 14px 16px; margin-bottom: 10px; }
.gai-story:last-child { margin-bottom: 0; }
.gai-story-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 6px; }
.gai-story-title { font-size: 1.06rem; }
.gai-status { font-size: 0.8rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.gai-status.st-new { background: #e8f0fe; color: #174ea6; }
.gai-status.st-developing { background: #f3e8fd; color: #7b3fbf; }
.gai-status.st-escalating { background: #fce8e6; color: var(--neg); }
.gai-status.st-de-escalating { background: #e6f4ea; color: var(--pos); }
.gai-status.st-resolved { background: #f1f3f4; color: var(--ink-2); }
.gai-status.st-recurring { background: #fef7e0; color: #b06000; }
.gai-change { display: flex; gap: 10px; background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 0.95rem; margin-bottom: 10px; }
.gai-change i { color: var(--g-purple); margin-top: 3px; }
.gai-change b { margin-right: 6px; }
.gai-tl { list-style: none; margin: 0; padding: 0 0 0 4px; position: relative; }
.gai-tl::before { content: ""; position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(#4285f4, #9b72cb, #d96570); border-radius: 2px; }
.gai-tl li { position: relative; padding: 0 0 10px 28px; }
.gai-tl li::before { content: ""; position: absolute; left: 1px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2.5px solid var(--g-purple); }
.gai-tl-when { font-size: 0.84rem; font-weight: 600; color: var(--g-blue); }
.gai-tl-body { font-size: 0.96rem; }

/* Daily */
.gai-day { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f1f3f4; }
.gai-day:last-child { border-bottom: 0; }
.gai-day-date { width: 78px; flex: none; text-align: center; background: var(--surface); border-radius: 12px; padding: 8px 4px; align-self: flex-start; }
.gai-day-date b { display: block; font-size: 1rem; }
.gai-day-date small { color: var(--ink-2); display: block; }
.gai-mom { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; align-items: center; justify-content: center; font-size: 0.7rem; margin-top: 4px; background: #f1f3f4; color: var(--ink-2); }
.gai-mom.m-rising { background: #fce8e6; color: var(--neg); }
.gai-mom.m-peak { background: var(--g-grad); color: #fff; }
.gai-mom.m-falling { background: #e6f4ea; color: var(--pos); }
.gai-day-body { flex: 1; min-width: 0; }
.gai-day-metrics { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; font-size: 0.88rem; color: var(--ink-2); margin-bottom: 6px; }
.gai-metric i { margin-right: 4px; }
.gai-metric em { font-style: normal; font-weight: 600; margin-left: 4px; font-size: 0.82rem; }
.gai-metric em.up { color: #e8710a; }
.gai-metric em.down { color: #1a73e8; }
.gai-metric em.better { color: var(--pos); }
.gai-metric em.worse { color: var(--neg); }
.gai-metric.sh-better { color: var(--pos); font-weight: 600; }
.gai-metric.sh-worse { color: var(--neg); font-weight: 600; }
.gai-day-head { font-weight: 600; font-size: 1.02rem; }
.gai-day-sum { font-size: 0.95rem; color: #3c4043; line-height: 1.6; }

/* Themes */
.gai-trend { font-size: 0.78rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; white-space: nowrap; background: #f1f3f4; color: var(--ink-2); }
.gai-trend.tr-up { background: #fce8e6; color: var(--neg); }
.gai-trend.tr-down { background: #e6f4ea; color: var(--pos); }
.gai-trend.tr-new { background: #f3e8fd; color: #7b3fbf; }
.gai-li { padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 0.96rem; }
.gai-li:last-child { border-bottom: 0; }

/* Issues (themes) — compact */
.gai-issues { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 12px; margin-top: 14px; }
.gai-issues > * { min-width: 0; }
.gai-issue { border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; background: #fff; display: flex; flex-direction: column; gap: 8px; }
.gai-issue-head { display: flex; gap: 10px; align-items: flex-start; }
.gai-issue-no { width: 26px; height: 26px; flex: none; border-radius: 8px; background: var(--g-grad); color: #fff; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.gai-issue-title { font-size: 1.06rem; font-weight: 700; margin: 0; line-height: 1.45; }
.gai-issue-title .gai-trend { font-size: 0.76rem; vertical-align: 2px; margin-left: 4px; }
.gai-issue-desc { margin: 2px 0 0; font-size: 0.92rem; color: var(--ink-2); line-height: 1.5; }
.gai-issue-share { flex: none; font-size: 1.15rem; font-weight: 700; background: var(--g-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gai-issue-stm { display: grid; gap: 4px; }
.gai-sbar.xs { height: 6px; }
.gai-issue-nums { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 10px; font-size: 0.84rem; font-weight: 600; }
.gai-issue-nums .gai-muted { font-weight: 400; }
.gai-debate { margin: 0; font-size: 0.92rem; color: #3c4043; line-height: 1.55; }
.gai-debate i { color: var(--g-purple); margin-right: 6px; }
.gai-views { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.gai-views li { display: flex; gap: 8px; font-size: 0.94rem; line-height: 1.5; padding: 5px 8px; border-radius: 8px; }
.gai-views li i { margin-top: 4px; font-size: 0.86rem; flex: none; }
.gai-views li.pos { background: #f3faf5; }
.gai-views li.pos i { color: #34a853; }
.gai-views li.neg { background: #fef6f5; }
.gai-views li.neg i { color: #ea4335; }
.gai-issue-foot { display: grid; gap: 6px; margin-top: auto; padding-top: 4px; }
.gai-issue-foot-lbl { font-size: 0.8rem; color: var(--ink-2); font-weight: 600; }
@media (max-width: 576px) { .gai-issues { grid-template-columns: 1fr; } }

/* Net Sentiment tile (รวมสัดส่วน Sentiment ไว้ในการ์ดเดียว) */
.gai-tile-senti { align-items: center; }
.gai-tile-senti .gai-tile-ico { color: #fff; font-size: 1.25rem; border-radius: 50%; }
.gai-tile-main { flex: 1; min-width: 0; display: grid; gap: 5px; }
.gai-tile-top { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.gai-tile-verdict { font-size: 0.86rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gai-tile-pcts { display: flex; flex-wrap: wrap; gap: 0 8px; font-size: 0.74rem; font-weight: 600; }
.gai-tile-senti.v-neg2 .gai-tile-verdict { color: #c5221f; }
.gai-tile-senti.v-neg .gai-tile-verdict { color: #d93025; }
.gai-tile-senti.v-pos2 .gai-tile-verdict { color: #137333; }
.gai-tile-senti.v-pos .gai-tile-verdict { color: #1e8e3e; }
.gai-tile-senti.v-neu .gai-tile-verdict { color: #b06000; }
.gai-tile-senti { position: relative; cursor: help; outline: none; }
.gai-tile-info { position: absolute; top: 8px; right: 10px; font-size: 0.78rem; color: #bdc1c6; transition: color 0.15s; }
.gai-tile-senti:hover .gai-tile-info, .gai-tile-senti:focus .gai-tile-info { color: var(--g-purple); }
.gai-explain {
  position: absolute; z-index: 30; top: calc(100% + 8px); left: 50%; width: 320px; margin-left: -160px;
  background: #fff; border-radius: 14px; padding: 12px 14px; text-align: left; cursor: default;
  box-shadow: 0 10px 30px rgba(60, 64, 67, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  opacity: 0; visibility: hidden; transform: translateY(-4px); transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
}
.gai-explain::before { content: ""; position: absolute; top: -6px; left: 50%; margin-left: -6px; width: 12px; height: 12px; background: #fff; transform: rotate(45deg); box-shadow: -1px -1px 0 rgba(0, 0, 0, 0.05); }
.gai-tile-senti:hover .gai-explain, .gai-tile-senti:focus .gai-explain, .gai-tile-senti:focus-within .gai-explain { opacity: 1; visibility: visible; transform: none; }
.gai-explain-title { font-weight: 700; font-size: 0.92rem; margin-bottom: 6px; }
.gai-explain-title i { color: var(--g-purple); margin-right: 4px; }
.gai-explain p { font-size: 0.84rem; line-height: 1.55; margin: 0 0 8px; color: #3c4043; }
.gai-explain-formula { display: grid; gap: 2px; background: var(--g-soft); border-radius: 10px; padding: 7px 10px; margin-bottom: 8px; }
.gai-explain-formula span { font-weight: 700; font-size: 0.86rem; }
.gai-explain-formula small { font-size: 0.78rem; color: var(--ink-2); }
.gai-explain-scale { display: grid; gap: 3px; margin-bottom: 6px; }
.gai-explain-scale > div { font-size: 0.8rem; padding: 3px 8px; border-radius: 8px; color: var(--ink-2); }
.gai-explain-scale > div b { color: var(--ink); margin-right: 4px; }
.gai-explain-scale > div.on { background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); color: var(--ink); font-weight: 600; }
.gai-explain-note { display: block; font-size: 0.72rem; color: #80868b; line-height: 1.5; }
.gai-kw-panel { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 0; padding: 10px 14px; }
.gai-kw-panel .gai-kw { margin-bottom: 0; }
.gai-kw-lbl { font-weight: 700; font-size: 0.88rem; margin-right: 10px; white-space: nowrap; }
.gai-kw-lbl i { color: var(--g-purple); margin-right: 4px; }

/* Overview layout */
.gai-ov-row { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 12px; margin-top: 12px; }
.gai-ov-row.single { grid-template-columns: 1fr; }
.gai-ov-row .gai-panel-title i { color: var(--g-purple); }
.gai-section { margin-top: 22px; }
.gai-section-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; margin-bottom: 2px; }
.gai-section-head h4 { margin: 0; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.gai-section-head h4 > i { width: 30px; height: 30px; border-radius: 10px; background: var(--g-soft); color: var(--g-purple); font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; }
.gai-section-head .gai-tag { align-self: center; }
.gai-callout { display: flex; gap: 12px; margin-top: 12px; padding: 12px 16px; border-radius: 14px; background: var(--g-soft); font-size: 0.95rem; line-height: 1.6; }
.gai-callout > i { color: var(--g-purple); margin-top: 4px; }
.gai-callout b { display: block; font-size: 0.88rem; margin-bottom: 2px; }

/* Recommendations */
.gai-recos { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin-top: 12px; }
.gai-recos > * { min-width: 0; }
.gai-reco-card { position: relative; border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px 14px 20px; background: #fff; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
.gai-reco-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: #bdc1c6; }
.gai-reco-card.lv-high::before { background: #ea4335; }
.gai-reco-card.lv-medium::before { background: #fbbc04; }
.gai-reco-card.opp::before { background: var(--g-grad); }
.gai-reco-card.lv-high { background: linear-gradient(180deg, #fff8f7, #fff 60%); }
.gai-reco-top { display: flex; align-items: center; gap: 8px; }
.gai-reco-no { width: 26px; height: 26px; border-radius: 50%; background: var(--g-soft); color: var(--g-purple); font-weight: 700; font-size: 0.82rem; display: inline-flex; align-items: center; justify-content: center; }
.gai-reco-action { font-weight: 700; font-size: 1rem; line-height: 1.5; }
.gai-reco-why { font-size: 0.9rem; color: var(--ink-2); line-height: 1.6; }
.gai-reco-why i { margin-right: 6px; color: #9aa0a6; }
@media (max-width: 768px) { .gai-ov-row { grid-template-columns: 1fr; } }

/* Sample comments in issue card */
.gai-cmts { border-top: 1px dashed var(--line); padding-top: 10px; display: grid; gap: 8px; }
.gai-cmts-title { font-size: 0.84rem; font-weight: 700; color: var(--ink-2); }
.gai-cmts-title i { color: var(--g-purple); margin-right: 6px; }
.gai-cmt { display: flex; gap: 10px; padding: 10px 12px; border-radius: 12px; background: var(--surface); border-left: 3px solid #bdc1c6; min-width: 0; }
.gai-cmt.st-positive { border-left-color: #34a853; }
.gai-cmt.st-negative { border-left-color: #ea4335; }
.gai-cmt.st-neutral { border-left-color: #fbbc04; }
.gai-cmt-av { flex: none; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: var(--g-grad); color: #fff; font-weight: 700; text-decoration: none !important; box-shadow: 0 0 0 2px #fff; }
.gai-cmt-av img { width: 100%; height: 100%; object-fit: cover; background: #e8eaed; }
.gai-cmt-body { flex: 1; min-width: 0; display: grid; gap: 3px; }
.gai-cmt-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
.gai-cmt-name { font-weight: 700; font-size: 0.9rem; color: var(--ink) !important; text-decoration: none !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
a.gai-cmt-name:hover { color: var(--g-blue) !important; }
.gai-cmt-head .gai-chip { padding: 2px 9px; font-size: 0.74rem; }
.gai-cmt-text { font-size: 0.92rem; line-height: 1.55; color: #202124; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }
.gai-cmt-why { font-size: 0.8rem; color: var(--ink-2); }
.gai-cmt-why i { color: var(--g-purple); margin-right: 5px; font-size: 0.72rem; }
.gai-cmt-src { font-size: 0.78rem; color: var(--ink-2); }
.gai-cmt-src a { color: var(--g-blue) !important; text-decoration: none !important; }
.gai-cmt-src a:hover { text-decoration: underline !important; }
.gai-cmt-src .fa-external-link-alt { font-size: 0.66rem; margin-left: 2px; }
.gai-more { justify-self: start; border: 0; background: none; color: var(--g-blue); font-size: 0.82rem; font-weight: 600; padding: 2px 4px; cursor: pointer; }
.gai-more:hover { text-decoration: underline; }

/* Verdict: ทิศทางความเห็นแบบดูแล้วรู้ */
.gai-verdict { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: #fff; border: 1px solid var(--line); }
.gai-verdict-ico { width: 34px; height: 34px; flex: none; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1.15rem; color: #fff; }
.gai-verdict-txt { display: grid; line-height: 1.25; min-width: 0; }
.gai-verdict-txt b { font-size: 0.98rem; }
.gai-verdict-txt small { font-size: 0.74rem; color: var(--ink-2); }
.gai-verdict.lg { margin: 2px 0 12px; padding: 10px 14px; }
.gai-verdict.lg .gai-verdict-ico { width: 44px; height: 44px; font-size: 1.5rem; }
.gai-verdict.lg .gai-verdict-txt b { font-size: 1.15rem; }
.v-neg2 .gai-verdict-ico { background: #d93025; } .v-neg2 .gai-verdict-txt b { color: #c5221f; } .gai-verdict.v-neg2 { background: #fef6f5; border-color: #f6c7c2; }
.v-neg .gai-verdict-ico { background: #ea4335; } .v-neg .gai-verdict-txt b { color: #d93025; } 
.gai-verdict.v-neg { background:  #ffffff; border-color: #ffffff; }
.v-pos2 .gai-verdict-ico { background: #1e8e3e; } .v-pos2 .gai-verdict-txt b { color: #137333; } .gai-verdict.v-pos2 { background: #f3faf5; border-color: #b7dfc2; }
.v-pos .gai-verdict-ico { background: #34a853; } .v-pos .gai-verdict-txt b { color: #1e8e3e; } .gai-verdict.v-pos { background:  #ffffff; border-color: #ffffff; }
.v-neu .gai-verdict-ico { background: #fbbc04; } .v-neu .gai-verdict-txt b { color: #b06000; } .gai-verdict.v-neu{ background:  #ffffff; border-color: #ffffff; }
/* meter: แดง (ลบ) ← กลาง → เขียว (บวก) พร้อมเข็มชี้ */
.gai-meter { position: relative; flex: 1; min-width: 120px; max-width: 360px; height: 30px; margin-left: auto; }
.gai-meter-track { position: absolute; left: 0; right: 0; top: 9px; height: 8px; border-radius: 999px; background: linear-gradient(90deg, #ea4335 0%, #f6aea9 28%, #fdd663 50%, #a8dab5 72%, #34a853 100%); }
.gai-meter-mark { position: absolute; top: 3px; width: 6px; height: 20px; margin-left: -3px; border-radius: 3px; background: #202124; box-shadow: 0 0 0 2px #fff; transition: left 0.4s ease; }
.gai-meter-mark em { position: absolute; top: -17px; left: 50%; transform: translateX(-50%); font-style: normal; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.gai-meter-lbl { position: absolute; bottom: -4px; font-size: 0.66rem; color: var(--ink-2); }
.gai-meter-lbl.l { left: 0; } .gai-meter-lbl.c { left: 50%; transform: translateX(-50%); } .gai-meter-lbl.r { right: 0; }
.gai-verdict.lg .gai-meter { height: 38px; }
.gai-verdict.lg .gai-meter-track { top: 13px; }
.gai-verdict.lg .gai-meter-mark { top: 7px; }
.gai-meter.sm { min-width: 90px; max-width: 160px; height: 20px; }
.gai-meter.sm .gai-meter-track { top: 6px; height: 7px; }
.gai-meter.sm .gai-meter-mark { top: 1px; height: 17px; width: 5px; }
.gai-split { font-size: 0.8rem; font-weight: 600; color: #b06000; background: #fef7e0; border-radius: 8px; padding: 4px 10px; }
.gai-split i { margin-right: 6px; }
@media (max-width: 576px) { .gai-verdict .gai-meter { display: none; } }

/* Issue: sentiment rows (posts / comments) */
.gai-stm-rows { display: grid; gap: 6px; background: var(--surface); border-radius: 12px; padding: 10px 12px; }
.gai-stm-row { display: grid; grid-template-columns: 118px minmax(0, 1fr) auto; align-items: center; gap: 10px; }
.gai-stm-lbl { font-size: 0.82rem; color: var(--ink-2); white-space: nowrap; }
.gai-stm-lbl i { margin-right: 4px; color: var(--g-purple); }
.gai-stm-lbl b { color: var(--ink); }
.gai-stm-pct { display: flex; gap: 8px; font-size: 0.82rem; white-space: nowrap; }
.gai-stm-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 12px; font-size: 0.78rem; color: var(--ink-2); margin-top: 2px; }
.gai-stm-meta .dot { width: 7px; height: 7px; margin: 0 3px 0 6px; }
.gai-stm-meta .dot:first-child { margin-left: 0; }
.gai-stm-meta .fa-info-circle { color: #9aa0a6; }

.gai-dom { display: inline-flex; align-items: center; gap: 4px; margin-left: 6px; font-size: 0.72rem; font-weight: 700; padding: 1px 8px; border-radius: 999px; vertical-align: 1px; }
.gai-dom.st-negative { background: #fce8e6; color: #c5221f; }
.gai-dom.st-positive { background: #e6f4ea; color: #137333; }
.gai-dom i { color: inherit !important; margin: 0 !important; font-size: 0.7rem; }
/* Issue: arguments from all comments */
.gai-arg { border-radius: 12px; padding: 10px 12px; display: grid; gap: 8px; }
.gai-arg.st-positive { background: #f3faf5; }
.gai-arg.st-negative { background: #fef6f5; }
.gai-arg-head { display: flex; align-items: flex-start; gap: 8px; }
.gai-arg-head > i { margin-top: 4px; font-size: 0.85rem; }
.gai-arg.st-positive .gai-arg-head > i { color: #34a853; }
.gai-arg.st-negative .gai-arg-head > i { color: #ea4335; }
.gai-arg-point { flex: 1; font-weight: 600; font-size: 0.93rem; line-height: 1.5; }
.gai-arg-count { flex: none; font-size: 0.76rem; font-weight: 700; padding: 2px 9px; border-radius: 999px; background: #fff; color: var(--ink-2); white-space: nowrap; }
.gai-cmt.mini { background: #fff; border-left: 0; padding: 8px 10px; }
.gai-cmt.mini .gai-cmt-av { width: 30px; height: 30px; font-size: 0.8rem; }
.gai-cmt.mini .gai-cmt-text { font-size: 0.88rem; -webkit-line-clamp: 3; }
.gai-cmt-from { font-size: 0.76rem; color: var(--ink-2) !important; text-decoration: none !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.gai-cmt-from:hover { color: var(--g-blue) !important; }
@media (max-width: 576px) { .gai-stm-row { grid-template-columns: 1fr; gap: 4px; } }

/* Post peek (hover on P-chip) */
.gai-peek { position: fixed; z-index: 2000; animation: gai-peek-in 0.12s ease-out; }
@keyframes gai-peek-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.gai-peek-card { display: block; background: #fff; border-radius: 14px; overflow: hidden; text-decoration: none !important; color: var(--ink) !important; box-shadow: 0 10px 30px rgba(60, 64, 67, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04); }
.gai-peek-media { position: relative; aspect-ratio: 16 / 9; background: #e8eaed; overflow: hidden; }
.gai-peek-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gai-peek-media .gai-img-cap { padding-top: 22px; }
.gai-peek-head { display: flex; align-items: center; gap: 8px; padding: 10px 12px 0; }
.gai-peek-av { width: 30px; height: 30px; flex: none; border-radius: 50%; overflow: hidden; background: var(--g-grad); color: #fff; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.gai-peek-av img { width: 100%; height: 100%; object-fit: cover; }
.gai-peek-name { flex: 1; min-width: 0; font-weight: 700; font-size: 0.86rem; }
.gai-peek-ref { font-size: 0.72rem; padding: 0 7px; border-radius: 999px; background: #e8f0fe; color: #1a73e8; }
.gai-peek-body { padding: 9px 12px 11px; display: grid; gap: 6px; }
.gai-peek-text { font-size: 0.86rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }
.gai-peek-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; font-size: 0.74rem; color: var(--ink-2); }
.gai-peek-meta .gai-chip { padding: 1px 8px; font-size: 0.7rem; }
.gai-peek-open { margin-left: auto; color: var(--g-blue); font-weight: 600; }
.gai-peek-open i { font-size: 0.62rem; }

/* Risks */
.gai-risk { border-left: 3px solid #dadce0; padding: 8px 12px; margin-bottom: 8px; border-radius: 0 10px 10px 0; background: var(--surface); }
.gai-risk.lv-high { border-color: #ea4335; background: #fef6f5; }
.gai-risk.lv-medium { border-color: #fbbc04; }

/* People */
.gai-person { display: flex; gap: 12px; background: var(--surface); border-radius: 14px; padding: 12px 14px; }
.gai-avatar-wrap { position: relative; flex: none; width: 48px; height: 48px; text-decoration: none !important; }
.gai-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--g-grad); color: #fff; font-weight: 700; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; }
.gai-avatar.img { object-fit: cover; background: #e8eaed; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #e3dcf5; }
.gai-pf { position: absolute; right: -3px; bottom: -3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); }
.pf-fb { color: #1877f2; } .pf-tt { color: #000; } .pf-yt { color: #ff0000; } .pf-x { color: #000; } .pf-ig { color: #e1306c; } .pf-news { color: #5f6368; }
.gai-acc { font-weight: 700; color: var(--ink) !important; text-decoration: none !important; }
.gai-acc:hover { color: var(--g-blue) !important; }
.gai-src-note { margin-top: 10px; font-size: 0.84rem; color: #80868b; }
.gai-src-note i { margin-right: 5px; color: var(--g-purple); }

/* Posts */
.gai-raw { white-space: pre-wrap; font-size: 0.85rem; margin: 0; }
.gai-empty { text-align: center; color: var(--ink-2); padding: 30px 10px; font-size: 0.96rem; }
.gai-foot { display: grid; gap: 4px; margin-top: 14px; font-size: 0.8rem; color: #80868b; }

@media (max-width: 576px) {
  .gai-inner { padding: 16px; }
  .gai-actions { width: 100%; }
  .gai-btn { flex: 1; justify-content: center; }
  .gai-day-date { width: 64px; }
}
</style>

<style>
/* PostMinis (render function -> non-scoped) — กรอบตัวอย่างโพสต์เล็ก ๆ */
.gai-minis { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 150px)); gap: 8px; margin-top: 8px; }
.gai-mini { display: flex; flex-direction: column; min-width: 0; border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid var(--line); text-decoration: none !important; color: var(--ink) !important; transition: box-shadow 0.15s, transform 0.15s; }
.gai-mini:hover { box-shadow: 0 6px 18px rgba(60, 64, 67, 0.18); transform: translateY(-1px); }
.gai-mini.stm-positive { border-bottom: 3px solid #34a853; }
.gai-mini.stm-negative { border-bottom: 3px solid #ea4335; }
.gai-mini-media { position: relative; aspect-ratio: 16 / 9; background: #e8eaed; overflow: hidden; }
.gai-mini-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gai-mini-media .gai-img-cap { padding: 14px 7px 5px; font-size: 0.68rem; gap: 4px; }
.gai-mini-head { display: flex; align-items: center; gap: 6px; padding: 7px 8px 0; min-width: 0; }
.gai-mini-name { flex: 1; min-width: 0; font-size: 0.76rem; font-weight: 700; }
.gai-peek-av.sm { width: 22px; height: 22px; font-size: 0.7rem; }
.gai-mini-text { padding: 6px 8px 0; font-size: 0.76rem; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }
.gai-mini-meta { display: flex; gap: 8px; padding: 4px 8px 7px; margin-top: auto; font-size: 0.68rem; color: var(--ink-2); }
.gai-img-cap {
  position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: 6px;
  padding: 18px 10px 7px; font-size: 0.72rem; color: #fff; background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
}
.gai-img-cap b { margin-left: auto; font-size: 0.66rem; padding: 0 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.25); }
.gai-img-cap i { color: #fff !important; }
.gai-peek-av { width: 30px; height: 30px; flex: none; border-radius: 50%; overflow: hidden; background: var(--g-grad); color: #fff; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.gai-peek-av img { width: 100%; height: 100%; object-fit: cover; }
.gai-peek-ref { font-size: 0.72rem; padding: 0 7px; border-radius: 999px; background: #e8f0fe; color: #1a73e8; }

/* RefChips (render function -> non-scoped) */
.gai-refs { margin-top: 6px; }
.gai-refs.inline { display: inline; margin: 0 0 0 4px; }
.gai-ref {
  display: inline-block; min-width: 30px; text-align: center; font-size: 0.78rem; font-weight: 600; line-height: 1.6;
  padding: 0 7px; border-radius: 999px; margin: 0 4px 3px 0; text-decoration: none !important; cursor: pointer;
  background: #e8f0fe; color: #1a73e8 !important; transition: background 0.15s;
}
.gai-ref:hover { background: #d2e3fc; }
.gai-ref .fa-link { font-size: 0.62rem; opacity: 0.7; }
.gai-ref.stm-positive { background: #e6f4ea; color: #137333 !important; }
.gai-ref.stm-negative { background: #fce8e6; color: #c5221f !important; }
.gai-ref.big { font-size: 0.75rem; padding: 2px 9px; flex: none; }
</style>

