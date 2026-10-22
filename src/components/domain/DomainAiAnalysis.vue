<template>
  <section class="gai" :class="{ running: isRunning }">
    <div class="gai-inner">
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
                <b>{{ img.ref }}</b>
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
            <div class="gai-tile">
              <div class="gai-tile-ico purple"><i class="fas fa-balance-scale"></i></div>
              <div>
                <div class="gai-tile-val" :class="scoreClass(ov.net_sentiment_score)">{{ signed(ov.net_sentiment_score) }}</div>
                <div class="gai-tile-lbl">Net Sentiment (-100 ถึง +100)</div>
              </div>
            </div>
            <div class="gai-tile">
              <div class="gai-tile-ico pink"><i class="fas fa-bolt"></i></div>
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

          <div class="gai-panel">
            <div class="gai-panel-title">สัดส่วน Sentiment ภาพรวม</div>
            <div class="gai-sbar">
              <div class="pos" :style="{ width: ov.sentiment_percent.positive + '%' }"></div>
              <div class="neu" :style="{ width: ov.sentiment_percent.neutral + '%' }"></div>
              <div class="neg" :style="{ width: ov.sentiment_percent.negative + '%' }"></div>
            </div>
            <div class="gai-legend">
              <span><i class="dot pos"></i>บวก {{ fmt(ov.sentiment.positive) }} ({{ ov.sentiment_percent.positive }}%)</span>
              <span><i class="dot neu"></i>กลาง {{ fmt(ov.sentiment.neutral) }} ({{ ov.sentiment_percent.neutral }}%)</span>
              <span><i class="dot neg"></i>ลบ {{ fmt(ov.sentiment.negative) }} ({{ ov.sentiment_percent.negative }}%)</span>
            </div>
            <div class="gai-src-note">
              <i class="fas fa-database"></i>
              <template v-if="result.overview">สถิติภาพรวมทั้งหมดของ Domain<span v-if="sourceLabel"> (รวมทุกแพลตฟอร์ม)</span></template>
              <template v-else>ดึงสถิติภาพรวมไม่สำเร็จ — แสดงจากโพสต์ที่วิเคราะห์แทน</template>
              · AI อ่านเนื้อหาจาก {{ (result.posts || []).length }} โพสต์ที่ engagement สูงสุด
            </div>
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

          <div class="gai-panel" v-if="analysis && analysis.recommendations.length">
            <div class="gai-panel-title">ข้อเสนอแนะ</div>
            <div v-for="(r, i) in sortedRecos" :key="'rc' + i" class="gai-reco">
              <span class="gai-num">{{ i + 1 }}</span>
              <div class="flex-grow-1">
                <div><span class="gai-tag" :class="'lv-' + r.priority">{{ levelText[r.priority] }}</span><b>{{ r.action }}</b></div>
                <small class="gai-muted">{{ r.rationale }}</small>
              </div>
            </div>
          </div>

          <div class="gai-panel" v-if="analysis && analysis.keywords.length">
            <div class="gai-panel-title">คำสำคัญ</div>
            <span v-for="k in analysis.keywords" :key="'k' + k" class="gai-kw">{{ k }}</span>
          </div>
        </div>

        <!-- ===== TAB: Evolution (daily + storylines) ===== -->
        <div v-if="analysis" v-show="tab === 'evolution'">
          <div class="gai-panel" v-if="analysis.storylines.length">
            <div class="gai-panel-title">เรื่องที่สืบเนื่องกัน <small class="gai-muted ml-1">พัฒนาการของข่าวเดียวกันตามเวลา</small></div>
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
                  <div class="gai-tl-body">{{ t.development }} <RefChips :refs="t.post_refs" :map="postMap" inline /></div>
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
                  <RefChips :refs="d.ai.post_refs" :map="postMap" />
                </template>
                <div v-else class="gai-muted small">{{ d.total_posts ? "ไม่มีความเปลี่ยนแปลงสำคัญ" : "ไม่มีโพสต์ในวันนี้" }}</div>
              </div>
            </div>
          </div>
          <div v-if="!analysis.storylines.length && !multiDay" class="gai-empty">ไม่พบเรื่องที่สืบเนื่องกันในข้อมูลชุดนี้ — ลองเลือกช่วงหลายวันเพื่อดูการเปลี่ยนแปลง</div>
        </div>

        <!-- ===== TAB: Themes (กระชับ: แต่ละประเด็นมีความเห็นบวก/ลบ + มุมมองสองฝั่งของตัวเอง) ===== -->
        <div v-if="analysis" v-show="tab === 'themes'">
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
              <div class="gai-issue-stm" v-if="t.stats && t.stats.posts">
                <div class="gai-sbar xs" v-b-tooltip.hover :title="`บวก ${t.stats.sentiment_percent.positive}% · กลาง ${t.stats.sentiment_percent.neutral}% · ลบ ${t.stats.sentiment_percent.negative}%`">
                  <div class="pos" :style="{ width: t.stats.sentiment_percent.positive + '%' }"></div>
                  <div class="neu" :style="{ width: t.stats.sentiment_percent.neutral + '%' }"></div>
                  <div class="neg" :style="{ width: t.stats.sentiment_percent.negative + '%' }"></div>
                </div>
                <div class="gai-issue-nums">
                  <span class="c-pos">บวก {{ Math.round(t.stats.sentiment_percent.positive) }}%</span>
                  <span class="c-neu">กลาง {{ Math.round(t.stats.sentiment_percent.neutral) }}%</span>
                  <span class="c-neg">ลบ {{ Math.round(t.stats.sentiment_percent.negative) }}%</span>
                  <span class="gai-muted ml-auto">{{ t.stats.posts }} โพสต์ · <i class="fas fa-bolt"></i> {{ compact(t.stats.engagement) }} · net <b :class="scoreClass(t.stats.net_sentiment_score)">{{ signed(t.stats.net_sentiment_score) }}</b></span>
                </div>
              </div>

              <p v-if="t.debate_summary" class="gai-debate"><i class="fas fa-comments"></i>{{ t.debate_summary }}</p>

              <!-- มุมมองสองฝั่ง: แสดงเฉพาะฝั่งที่มี -->
              <ul v-if="t.supporting.length || t.opposing.length" class="gai-views">
                <li v-for="(n, k) in t.supporting" :key="'s' + k" class="pos">
                  <i class="fas fa-plus-circle"></i><span>{{ n.point }} <RefChips :refs="n.post_refs" :map="postMap" inline /></span>
                </li>
                <li v-for="(n, k) in t.opposing" :key="'o' + k" class="neg">
                  <i class="fas fa-minus-circle"></i><span>{{ n.point }} <RefChips :refs="n.post_refs" :map="postMap" inline /></span>
                </li>
              </ul>

              <footer class="gai-issue-foot" v-if="t.post_refs.length">
                <span>โพสต์ตัวอย่าง</span>
                <RefChips :refs="t.post_refs" :map="postMap" inline />
              </footer>
            </article>
          </div>

          <div class="gai-panel" v-if="analysis.audience_reaction">
            <div class="gai-panel-title"><i class="far fa-comments"></i> ปฏิกิริยาผู้ชมโดยรวม</div>
            <div class="small">{{ analysis.audience_reaction }}</div>
          </div>
        </div>

        <!-- ===== TAB: Risks ===== -->
        <div v-if="analysis" v-show="tab === 'risks'">
          <div class="gai-panel">
            <div class="gai-panel-title">ความเสี่ยง</div>
            <div v-if="!analysis.risks.length" class="gai-muted small">ไม่พบความเสี่ยงที่ชัดเจน</div>
            <div v-for="(r, i) in sortedRisks" :key="'r' + i" class="gai-risk" :class="'lv-' + r.level">
              <div><span class="gai-tag" :class="'lv-' + r.level">{{ levelText[r.level] }}</span><b>{{ r.title }}</b></div>
              <div class="small mt-1">{{ r.description }}</div>
              <RefChips :refs="r.post_refs" :map="postMap" />
            </div>
          </div>
          <div class="gai-grid2">
            <div class="gai-panel m-0">
              <div class="gai-panel-title"><i class="fas fa-search"></i> ข้อมูลที่ควรตรวจสอบ</div>
              <div v-if="!analysis.misinformation_signals.length" class="gai-muted small">ไม่พบสัญญาณที่น่าสงสัย</div>
              <div v-for="(m, i) in analysis.misinformation_signals" :key="'m' + i" class="gai-li">
                <b>“{{ m.claim }}”</b><div class="small gai-muted">{{ m.reason }}</div>
                <RefChips :refs="m.post_refs" :map="postMap" />
              </div>
            </div>
            <div class="gai-panel m-0">
              <div class="gai-panel-title"><i class="far fa-lightbulb"></i> โอกาสในการสื่อสาร</div>
              <div v-if="!analysis.opportunities.length" class="gai-muted small">-</div>
              <div v-for="(o, i) in analysis.opportunities" :key="'op' + i" class="gai-li">
                <b>{{ o.title }}</b><div class="small">{{ o.description }}</div>
                <RefChips :refs="o.post_refs" :map="postMap" />
              </div>
            </div>
          </div>
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
                <RefChips :refs="x.post_refs" :map="postMap" />
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
        const tip = [p.account_name, p.platform, p.title || p.text].filter(Boolean).join(" · ");
        return h(
          "a",
          {
            key: r,
            class: ["gai-ref", "stm-" + (p.sentiment || "neutral")],
            attrs: { title: tip, href: p.url_post || null, target: "_blank", rel: "noopener" },
            on: {
              click: (e) => {
                if (!p.url_post) e.preventDefault();
              },
            },
          },
          r
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
  components: { RefChips },
  data() {
    return {
      isRunning: false,
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
      savedAt: 0,
      copied: false,
      tab: "overview",
      steps: [
        { key: "fetching", label: "ดึงโพสต์" },
        { key: "analyzing", label: "AI วิเคราะห์" },
        { key: "finalizing", label: "สรุปผล" },
      ],
      features: [
        { i: "fas fa-align-left", t: "สรุปสถานการณ์", d: "พาดหัว + สรุปผู้บริหาร + ระดับสถานการณ์" },
        { i: "fas fa-chart-line", t: "การเปลี่ยนแปลงรายวัน", d: "เลือกหลายวัน เห็นแนวโน้มและสิ่งที่เปลี่ยน" },
        { i: "fas fa-stream", t: "ข่าวที่สืบเนื่องกัน", d: "ติดตามพัฒนาการของเรื่องเดียวกันตามเวลา" },
        { i: "fas fa-shield-alt", t: "ความเสี่ยง & ข่าวลือ", d: "พร้อมข้อเสนอแนะและโพสต์อ้างอิง" },
      ],
      sentimentText: { positive: "เชิงบวก", neutral: "เป็นกลาง", negative: "เชิงลบ", mixed: "ผสม" },
      levelText: { high: "สูง", medium: "กลาง", low: "ต่ำ" },
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
      const w = Math.max(900, n * 70);
      const h = 300;
      const pl = 20, pr = 20, pb = 26;
      const lineTop = 38, lineH = 64; // แถบ net sentiment ด้านบน
      const barTop = lineTop + lineH + 46; // แถบแท่งจำนวนโพสต์ด้านล่าง
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
      t.push({ key: "evolution", label: this.multiDay ? "พัฒนาการ & รายวัน" : "พัฒนาการข่าว", icon: "fas fa-stream", count: (a.storylines || []).length });
      t.push({ key: "themes", label: "ประเด็น", icon: "fas fa-layer-group", count: (a.key_themes || []).length });
      t.push({ key: "risks", label: "ความเสี่ยง", icon: "fas fa-shield-alt", count: (a.risks || []).length });
      t.push({ key: "people", label: "ผู้มีอิทธิพล", icon: "fas fa-user-friends" });
      return t;
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
      const order = ["queued", "fetching", "analyzing", "finalizing", "done"];
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
        this.saveResult(key);
        this.resultKey = key;
        this.tab = "overview";
        this.finish();
      } else if (job.status === "error") {
        this.fail((job.error && job.error.message) || "AI วิเคราะห์ไม่สำเร็จ");
      } else {
        if (Date.now() - this.startedAt > 6 * 60 * 1000) return this.fail("ใช้เวลานานเกินไป กรุณาลองใหม่");
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
  beforeDestroy() {
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
.gai-sub { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 0.8rem; color: var(--ink-2); }
.gai-sub-item i { margin-right: 4px; opacity: 0.7; }
.gai-actions { display: flex; align-items: center; gap: 8px; }
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
.gai-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 600; padding: 4px 11px; border-radius: 999px; background: #fff; color: var(--ink-2); }
.gai-chip.soft { background: rgba(255, 255, 255, 0.7); font-weight: 500; }
.gai-chip.lvl .pulse { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.gai-chip.lvl-normal { color: var(--pos); }
.gai-chip.lvl-watch { color: #b06000; }
.gai-chip.lvl-alert { color: #e8710a; }
.gai-chip.lvl-critical { color: #fff; background: var(--neg); }
.gai-chip.lvl-alert .pulse, .gai-chip.lvl-critical .pulse { animation: gai-blink 1s infinite; }
@keyframes gai-blink { 50% { opacity: 0.2; } }
.gai-chip.stm-positive { color: var(--pos); background: #e6f4ea; }
.gai-chip.stm-neutral { color: #5f6368; background: #f1f3f4; }
.gai-chip.stm-negative { color: var(--neg); background: #fce8e6; }
.gai-chip.stm-mixed { color: #b06000; background: #fef7e0; }
.gai-headline { font-size: 1.3rem; font-weight: 700; line-height: 1.45; margin: 0 0 8px; color: var(--ink); }
.gai-summary { font-size: 0.97rem; line-height: 1.75; margin-bottom: 10px; color: #3c4043; }
.gai-reasons { display: grid; gap: 4px; font-size: 0.82rem; color: var(--ink-2); }
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
.gai-tile-lbl { font-size: 0.75rem; color: var(--ink-2); }
.c-pos { color: var(--pos); } .c-neg { color: var(--neg); } .c-neu { color: var(--ink-2); }

.gai-panel { border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; margin-top: 12px; }
.gai-panel-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 10px; }
.gai-panel-title i { margin-right: 6px; color: var(--g-purple); }
.gai-grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin-top: 12px; }

.gai-sbar, .gai-mini-sbar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; background: #f1f3f4; gap: 2px; }
.gai-mini-sbar { height: 6px; width: 120px; }
.gai-sbar .pos, .gai-mini-sbar .pos, .dot.pos, .bg-positive { background: #34a853; }
.gai-sbar .neu, .gai-mini-sbar .neu, .dot.neu, .bg-neutral { background: #bdc1c6; }
.gai-sbar .neg, .gai-mini-sbar .neg, .dot.neg, .bg-negative { background: #ea4335; }
.bg-mixed { background: #fbbc04; }
.gai-legend { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 0.8rem; color: var(--ink-2); margin-top: 8px; font-weight: 400; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
.dot.grad { background: #9fadf8; border-radius: 3px; }
.gai-legend .line { display: inline-block; width: 16px; height: 3px; border-radius: 2px; background: var(--g-grad); margin-right: 6px; vertical-align: middle; }

/* Chart */
.gai-chart-wrap { overflow-x: auto; }
.gai-chart { width: 100%; height: auto; display: block; }
.gai-chart .band { font-size: 11px; fill: #9aa0a6; }
.gai-chart .net { font-size: 11px; font-weight: 600; text-anchor: middle; fill: var(--ink-2); }
.gai-chart .net.c-pos { fill: #1e8e3e; }
.gai-chart .net.c-neg { fill: #d93025; }
.gai-chart .zero { stroke: #dadce0; stroke-dasharray: 4 4; }
.gai-chart .val { font-size: 11px; font-weight: 600; fill: var(--ink-2); text-anchor: middle; }
.gai-chart .axis { font-size: 11px; fill: var(--ink-2); text-anchor: middle; }
.gai-chart .pt { stroke: #fff; stroke-width: 2; fill: var(--g-purple); }
.gai-chart .pt.c-pos { fill: #34a853; }
.gai-chart .pt.c-neg { fill: #ea4335; }
.gai-trend-text { margin: 10px 0 0; padding: 10px 14px; background: var(--g-soft); border-radius: 12px; font-size: 0.9rem; line-height: 1.65; }
.gai-trend-text i { margin-right: 6px; color: var(--g-purple); }

/* Reco & keywords */
.gai-reco { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--line); }
.gai-reco:last-child { border-bottom: 0; }
.gai-num { width: 24px; height: 24px; flex: none; border-radius: 50%; background: var(--g-soft); color: var(--g-purple); font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.gai-tag { display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 1px 8px; border-radius: 6px; margin-right: 8px; vertical-align: 1px; }
.gai-tag.lv-high { background: #fce8e6; color: var(--neg); }
.gai-tag.lv-medium { background: #fef7e0; color: #b06000; }
.gai-tag.lv-low { background: #f1f3f4; color: var(--ink-2); }
.gai-kw { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; padding: 4px 12px; border-radius: 999px; margin: 0 6px 6px 0; background: #f1f3f4; }
.gai-kw.hash { background: #e8f0fe; color: #174ea6; }
.gai-kw.new { background: #f3e8fd; color: #7b3fbf; font-size: 0.74rem; padding: 2px 10px; }
.gai-kw b { font-weight: 600; opacity: 0.7; }

/* Storylines */
.gai-story { border-radius: 14px; background: var(--surface); padding: 14px 16px; margin-bottom: 10px; }
.gai-story:last-child { margin-bottom: 0; }
.gai-story-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 6px; }
.gai-story-title { font-size: 0.98rem; }
.gai-status { font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.gai-status.st-new { background: #e8f0fe; color: #174ea6; }
.gai-status.st-developing { background: #f3e8fd; color: #7b3fbf; }
.gai-status.st-escalating { background: #fce8e6; color: var(--neg); }
.gai-status.st-de-escalating { background: #e6f4ea; color: var(--pos); }
.gai-status.st-resolved { background: #f1f3f4; color: var(--ink-2); }
.gai-status.st-recurring { background: #fef7e0; color: #b06000; }
.gai-change { display: flex; gap: 10px; background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 0.86rem; margin-bottom: 10px; }
.gai-change i { color: var(--g-purple); margin-top: 3px; }
.gai-change b { margin-right: 6px; }
.gai-tl { list-style: none; margin: 0; padding: 0 0 0 4px; position: relative; }
.gai-tl::before { content: ""; position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(#4285f4, #9b72cb, #d96570); border-radius: 2px; }
.gai-tl li { position: relative; padding: 0 0 10px 28px; }
.gai-tl li::before { content: ""; position: absolute; left: 1px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2.5px solid var(--g-purple); }
.gai-tl-when { font-size: 0.74rem; font-weight: 600; color: var(--g-blue); }
.gai-tl-body { font-size: 0.88rem; }

/* Daily */
.gai-day { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f1f3f4; }
.gai-day:last-child { border-bottom: 0; }
.gai-day-date { width: 78px; flex: none; text-align: center; background: var(--surface); border-radius: 12px; padding: 8px 4px; align-self: flex-start; }
.gai-day-date b { display: block; font-size: 0.9rem; }
.gai-day-date small { color: var(--ink-2); display: block; }
.gai-mom { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; align-items: center; justify-content: center; font-size: 0.7rem; margin-top: 4px; background: #f1f3f4; color: var(--ink-2); }
.gai-mom.m-rising { background: #fce8e6; color: var(--neg); }
.gai-mom.m-peak { background: var(--g-grad); color: #fff; }
.gai-mom.m-falling { background: #e6f4ea; color: var(--pos); }
.gai-day-body { flex: 1; min-width: 0; }
.gai-day-metrics { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; font-size: 0.8rem; color: var(--ink-2); margin-bottom: 6px; }
.gai-metric i { margin-right: 4px; }
.gai-metric em { font-style: normal; font-weight: 600; margin-left: 4px; font-size: 0.75rem; }
.gai-metric em.up { color: #e8710a; }
.gai-metric em.down { color: #1a73e8; }
.gai-metric em.better { color: var(--pos); }
.gai-metric em.worse { color: var(--neg); }
.gai-metric.sh-better { color: var(--pos); font-weight: 600; }
.gai-metric.sh-worse { color: var(--neg); font-weight: 600; }
.gai-day-head { font-weight: 600; font-size: 0.93rem; }
.gai-day-sum { font-size: 0.87rem; color: #3c4043; line-height: 1.6; }

/* Themes */
.gai-trend { font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; white-space: nowrap; background: #f1f3f4; color: var(--ink-2); }
.gai-trend.tr-up { background: #fce8e6; color: var(--neg); }
.gai-trend.tr-down { background: #e6f4ea; color: var(--pos); }
.gai-trend.tr-new { background: #f3e8fd; color: #7b3fbf; }
.gai-li { padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 0.9rem; }
.gai-li:last-child { border-bottom: 0; }

/* Issues (themes) — compact */
.gai-issues { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 12px; margin-top: 14px; }
.gai-issues > * { min-width: 0; }
.gai-issue { border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; background: #fff; display: flex; flex-direction: column; gap: 8px; }
.gai-issue-head { display: flex; gap: 10px; align-items: flex-start; }
.gai-issue-no { width: 26px; height: 26px; flex: none; border-radius: 8px; background: var(--g-grad); color: #fff; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.gai-issue-title { font-size: 0.98rem; font-weight: 700; margin: 0; line-height: 1.45; }
.gai-issue-title .gai-trend { font-size: 0.68rem; vertical-align: 2px; margin-left: 4px; }
.gai-issue-desc { margin: 2px 0 0; font-size: 0.82rem; color: var(--ink-2); line-height: 1.5; }
.gai-issue-share { flex: none; font-size: 1.15rem; font-weight: 700; background: var(--g-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gai-issue-stm { display: grid; gap: 4px; }
.gai-sbar.xs { height: 6px; }
.gai-issue-nums { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 10px; font-size: 0.74rem; font-weight: 600; }
.gai-issue-nums .gai-muted { font-weight: 400; }
.gai-debate { margin: 0; font-size: 0.82rem; color: #3c4043; line-height: 1.55; }
.gai-debate i { color: var(--g-purple); margin-right: 6px; }
.gai-views { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.gai-views li { display: flex; gap: 8px; font-size: 0.84rem; line-height: 1.5; padding: 5px 8px; border-radius: 8px; }
.gai-views li i { margin-top: 4px; font-size: 0.8rem; flex: none; }
.gai-views li.pos { background: #f3faf5; }
.gai-views li.pos i { color: #34a853; }
.gai-views li.neg { background: #fef6f5; }
.gai-views li.neg i { color: #ea4335; }
.gai-issue-foot { display: flex; align-items: center; gap: 6px; margin-top: auto; font-size: 0.74rem; color: var(--ink-2); }
@media (max-width: 576px) { .gai-issues { grid-template-columns: 1fr; } }

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
.gai-src-note { margin-top: 10px; font-size: 0.75rem; color: #80868b; }
.gai-src-note i { margin-right: 5px; color: var(--g-purple); }

/* Posts */
.gai-raw { white-space: pre-wrap; font-size: 0.85rem; margin: 0; }
.gai-empty { text-align: center; color: var(--ink-2); padding: 30px 10px; font-size: 0.9rem; }
.gai-foot { display: grid; gap: 4px; margin-top: 14px; font-size: 0.74rem; color: #80868b; }

@media (max-width: 576px) {
  .gai-inner { padding: 16px; }
  .gai-actions { width: 100%; }
  .gai-btn { flex: 1; justify-content: center; }
  .gai-day-date { width: 64px; }
}
</style>

<style>
/* RefChips (render function -> non-scoped) */
.gai-refs { margin-top: 6px; }
.gai-refs.inline { display: inline; margin: 0 0 0 4px; }
.gai-ref {
  display: inline-block; min-width: 30px; text-align: center; font-size: 0.7rem; font-weight: 600; line-height: 1.6;
  padding: 0 7px; border-radius: 999px; margin: 0 4px 3px 0; text-decoration: none !important; cursor: pointer;
  background: #e8f0fe; color: #1a73e8 !important; transition: background 0.15s;
}
.gai-ref:hover { background: #d2e3fc; }
.gai-ref.stm-positive { background: #e6f4ea; color: #137333 !important; }
.gai-ref.stm-negative { background: #fce8e6; color: #c5221f !important; }
.gai-ref.big { font-size: 0.75rem; padding: 2px 9px; flex: none; }
</style>
