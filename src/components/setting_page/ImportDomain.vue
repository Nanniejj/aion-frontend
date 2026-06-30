<template>
  <span>
    <b-button size="md" class="w-100 w-md-auto btn-importobj" pill
      style="background-color: #50c1d0; color: #2c3e50;" @click="open = true;">
      <i class="fa fa-upload" style="font-size: 18px; line-height: 1;"></i> Import
    </b-button>

    <vue-modaltor :visible="open" @hide="closeModal" :animation-panel="'modal-slide-top'"
      :resize-width='{ 3000: "100%", 1200: "100%", 768: "100%" }' class="import-fullscreen-modal">

      <div class="import-shell">
        <!-- Top bar -->
        <div class="import-topbar">
          <div class="import-topbar-title">
            <i class="fa fa-file-excel-o"></i>
            <span>Import Domain จากไฟล์ Excel</span>
          </div>
          <button class="import-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="import-body">
          <!-- Left: instructions / steps -->
          <div class="import-side" :class="{ 'is-collapsed': sidebarCollapsed }">
            <div class="import-side-inner">
              <b-row class="justify-content-end import-side-toggle-row " :class="{ 'm-4': sidebarCollapsed }">
                <button
                  class="import-side-toggle"
                  type="button"
                  @click="sidebarCollapsed = !sidebarCollapsed"
                  v-b-tooltip.hover
                  :title="sidebarCollapsed ? 'แสดงขั้นตอนการนำเข้า' : 'ย่อขั้นตอนการนำเข้า'"
                >
                  <i class="fa" :class="sidebarCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'"></i>
                </button>
              </b-row>

              <template v-if="!sidebarCollapsed">
              <!-- Dropzone -->
              <label class="import-dropzone justify-content-center" :class="{ 'has-file': !!selectedFile }">
                <input
                  ref="fileInput"
                  type="file"
                  accept=".xlsx,.xls"
                  class="import-dropzone-input"
                  @change="onNativeFileChange"
                  @dragover.prevent
                  @drop.prevent="onFileDrop"
                />
                <div class="import-dropzone-icon">
                  <i class="fa" :class="selectedFile ? 'fa-file-excel' : 'fa-cloud-upload'"></i>
                </div>
                <div class="import-dropzone-text">
                  <strong v-if="selectedFile">{{ selectedFile.name }}</strong>
                  <strong v-else>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</strong>
                  <span>รองรับไฟล์ .xlsx, .xls</span>
                </div>
                <b-button v-if="selectedFile" size="sm" class="import-dropzone-clear" @click.prevent.stop="clearFile">
                  <i class="fa fa-times"></i> เลือกไฟล์ใหม่
                </b-button>
              </label>
              <p class="import-side-eyebrow">ขั้นตอนการนำเข้า</p>

              <div class="import-step" :class="{ 'is-done': true }">
                <div class="import-step-num">1</div>
                <div class="import-step-text">
                  <div class="import-step-title">ดาวน์โหลดไฟล์ Template</div>
                  <div class="import-step-desc"> ไฟล์ตัวอย่างพร้อมหัวคอลัมน์ที่ระบบรองรับ </div>
                  <b-button class="import-template-btn mt-2" @click="downloadTemplate">
                    <i class="fa fa-download"></i> ดาวน์โหลด Template
                  </b-button>
                </div>
              </div>

              <div class="import-step" :class="{ 'is-done': !!selectedFile }">
                <div class="import-step-num">2</div>
                <div class="import-step-text">
                  <div class="import-step-title">กรอกข้อมูลและอัปโหลด</div>
                  <div class="import-step-desc">
                    กรอกข้อมูลตามคอลัมน์ที่กำหนดแล้วเลือกไฟล์ในช่องด้านล่าง
                  </div>
                </div>
              </div>

              <div class="import-step" :class="{ 'is-done': validRowCount > 0 && !importing }">
                <div class="import-step-num">3</div>
                <div class="import-step-text">
                  <div class="import-step-title">ตรวจสอบและนำเข้า</div>
                  <div class="import-step-desc">
                    ตรวจตัวอย่างข้อมูลแล้วกด<b>"นำเข้าข้อมูล"</b>เพื่อบันทึกทั้งหมดในครั้งเดียว
                  </div>
                </div>
              </div>

              <!-- <div class="import-columns-card">
                <div class="import-columns-title">
                  <i class="fa fa-table"></i> คอลัมน์ที่ระบบต้องการ
                </div>
                <ul class="import-columns-list">
                  <li><code>domain_name</code></li>
                  <li><code>subdomain_name</code></li>
                  <li><code>object_name</code> <span class="req">*จำเป็น</span></li>
                  <li><code>keywords</code></li>
                  <li><code>and_keywords</code></li>
                  <li><code>not_keywords</code></li>
                </ul>
                <p class="import-columns-note">
                  คั่นหลายคำใน 1 ช่องด้วย <code>,</code> หรือ <code>;</code>
                </p>
              </div> -->

              

              <!-- สถานะการนำเข้า -->
              <b-alert v-if="statusMessage" :variant="statusClass" show class="mt-3">
                {{ statusMessage }}
              </b-alert>
              </template>
            </div>
          </div>

          <!-- Right: preview -->
          <div class="import-main">
            <div class="import-main-inner">

              <!-- ตัวอย่างข้อมูลก่อนนำเข้า -->
              <div v-if="previewRows.length > 0" class="import-preview">
                <div class="import-preview-header">
                  <div>
                    <i class="fa fa-list-ul"></i>
                    พบข้อมูล <strong>{{ previewRows.length }}</strong> แถว
                    <span class="import-preview-hint">— กดปุ่มแก้ไขเพื่อเปิดแก้ไขข้อมูลแถวนั้น</span>
                  </div>
                  <div v-if="invalidRowCount > 0" class="import-preview-warning">
                    <i class="fa fa-exclamation-triangle"></i>
                    {{ invalidRowCount }} แถวข้อมูลไม่สมบูรณ์ — กรุณาแก้ไขให้ครบก่อนจึงจะนำเข้าได้
                  </div>
                </div>

                <div class="preview-table-wrapper import-table-view">
                  <b-table
                    :items="previewRows"
                    :fields="previewFields"
                    small
                    hover
                    responsive
                    class="import-table mb-0"
                    :tbody-tr-class="rowClass"
                  >
                    <template #cell(idx)="data">
                      {{ data.index + 1 }}
                    </template>

                    <template #cell(keywords)="data">
                      <span class="import-tag" v-for="(k, i) in data.item.keywords" :key="'k'+i">{{ k }}</span>
                      <span v-if="data.item.keywords.length === 0" class="import-cell-empty">—</span>
                    </template>

                    <template #cell(and_keywords)="data">
                      <span class="import-tag import-tag-and" v-for="(k, i) in data.item.and_keywords" :key="'a'+i">{{ k }}</span>
                      <span v-if="data.item.and_keywords.length === 0" class="import-cell-empty">—</span>
                    </template>

                    <template #cell(not_keywords)="data">
                      <span class="import-tag import-tag-not" v-for="(k, i) in data.item.not_keywords" :key="'n'+i">{{ k }}</span>
                      <span v-if="data.item.not_keywords.length === 0" class="import-cell-empty">—</span>
                    </template>

                    <template #cell(valid)="data">
                      <span
                        v-if="editingRowIndex === data.index"
                        class="import-row-status editing"
                        v-b-tooltip.hover
                        title="กำลังแก้ไขแถวนี้"
                      >
                        <i class="fa fa-pencil"></i> กำลังแก้ไข
                      </span>
                      <span v-else-if="data.item.valid" class="import-row-status ok"><i class="fa fa-check"></i> พร้อมนำเข้า </span>
                      <span v-else class="import-row-status fail" v-b-tooltip.hover :title="invalidReason(data.item)">
                        <i class="fa fa-exclamation"></i>
                      </span>
                    </template>

                    <template #cell(actions)="row">
                      <button
                        class="import-row-edit"
                        v-b-tooltip.hover
                        :title="row.detailsShowing ? 'ปิดการแก้ไข' : 'แก้ไขแถวนี้'"
                        @click="toggleRowEdit(row)"
                      >
                        <i class="fa" :class="row.detailsShowing ? 'fa-times' : 'fa-pencil'"></i>
                      </button>
                      <button class="import-row-delete" v-b-tooltip.hover title="ลบแถวนี้" @click="removeRow(row.index)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </template>

                    <!-- แผงแก้ไขข้อมูลแบบ row-details -->
                    <template #row-details="row">
                      <div class="import-row-edit-panel">
                        <div class="import-row-edit-grid">
                          <div class="import-edit-field" v-if="hasDomainName">
                            <label>domain_name</label>
                            <input v-model="editDraft.domain_name" class="import-edit-input" />
                          </div>
                          <div class="import-edit-field" v-if="hasSubdomainName">
                            <label>subdomain_name</label>
                            <input v-model="editDraft.subdomain_name" class="import-edit-input" />
                          </div>
                          <div class="import-edit-field" v-if="hasObjectName">
                            <label>object_name <span class="req">*จำเป็น</span></label>
                            <input v-model="editDraft.object_name" class="import-edit-input" />
                            <span v-if="hasForbiddenChars(editDraft.object_name)" class="import-edit-warning">
                              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ
                            </span>
                          </div>
                          <div class="import-edit-field" v-if="hasKeywords">
                            <label>keywords</label>
                            <b-form-tags
                              v-model="editDraft.keywords"
                              separator=",;"
                              placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                              add-button-text="เพิ่ม"
                              tag-variant="info"
                              class="import-edit-tags"
                              :tag-validator="tagValidator"
                              invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                            ></b-form-tags>
                          </div>
                          <div class="import-edit-field" v-if="hasAndKeywords">
                            <label>and_keywords</label>
                            <b-form-tags
                              v-model="editDraft.and_keywords"
                              separator=",;"
                              placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                              add-button-text="เพิ่ม"
                              tag-variant="warning"
                              class="import-edit-tags"
                              :tag-validator="tagValidator"
                              invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                            ></b-form-tags>
                          </div>
                          <div class="import-edit-field" v-if="hasNotKeywords">
                            <label>not_keywords</label>
                            <b-form-tags
                              v-model="editDraft.not_keywords"
                              separator=",;"
                              placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                              add-button-text="เพิ่ม"
                              tag-variant="danger"
                              class="import-edit-tags"
                              :tag-validator="tagValidator"
                              invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                            ></b-form-tags>
                          </div>
                        </div>
                        <div class="import-row-edit-actions">
                          <b-button class="import-btn-cancel" size="sm" @click="cancelRowEdit(row)">ยกเลิก</b-button>
                          <b-button
                            class="import-btn-submit"
                            size="sm"
                            :disabled="!editDraft.object_name || hasForbiddenChars(editDraft.object_name)"
                            @click="saveRowEdit(row)"
                          >
                            <i class="fa fa-check mr-1"></i> บันทึก
                          </b-button>
                        </div>
                      </div>
                    </template>
                  </b-table>
                </div>

                <!-- Card view สำหรับจอเล็ก — แสดงข้อมูลแถวเดียวกันแบบการ์ดแทนตาราง -->
                <div class="import-card-view">
                  <div
                    v-for="(item, idx) in previewRows"
                    :key="'card-' + idx"
                    class="import-row-card"
                    :class="{ 'row-invalid': !item.valid }"
                  >
                    <div class="import-row-card-header">
                      <span class="import-row-card-index">#{{ idx + 1 }}</span>

                      <span
                        v-if="editingRowIndex === idx"
                        class="import-row-status editing"
                      >
                        <i class="fa fa-pencil-alt"></i> กำลังแก้ไข
                      </span>
                      <span v-else-if="item.valid" class="import-row-status ok">
                        <i class="fa fa-check"></i> พร้อมนำเข้า
                      </span>
                      <span v-else class="import-row-status fail" v-b-tooltip.hover :title="invalidReason(item)">
                        <i class="fa fa-exclamation"></i>
                      </span>

                      <div class="import-row-card-actions">
                        <button
                          class="import-row-edit"
                          v-b-tooltip.hover
                          :title="item._showDetails ? 'ปิดการแก้ไข' : 'แก้ไขแถวนี้'"
                          @click="toggleCardEdit(idx)"
                        >
                          <i class="fa" :class="item._showDetails ? 'fa-times' : 'fa-pencil-alt'"></i>
                        </button>
                        <button class="import-row-delete" v-b-tooltip.hover title="ลบแถวนี้" @click="removeRow(idx)">
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <template v-if="!item._showDetails">
                      <div v-if="hasObjectName" class="import-row-card-field">
                        <span class="import-row-card-label">object_name</span>
                        <span class="import-row-card-value">{{ item.object_name || '—' }}</span>
                      </div>
                      <div v-if="hasDomainName" class="import-row-card-field">
                        <span class="import-row-card-label">domain_name</span>
                        <span class="import-row-card-value">{{ item.domain_name || '—' }}</span>
                      </div>
                      <div v-if="hasSubdomainName" class="import-row-card-field">
                        <span class="import-row-card-label">subdomain_name</span>
                        <span class="import-row-card-value">{{ item.subdomain_name || '—' }}</span>
                      </div>
                      <div v-if="hasKeywords" class="import-row-card-field">
                        <span class="import-row-card-label">keywords</span>
                        <span class="import-row-card-tags">
                          <span class="import-tag" v-for="(k, i) in item.keywords" :key="'ck'+i">{{ k }}</span>
                          <span v-if="item.keywords.length === 0" class="import-cell-empty">—</span>
                        </span>
                      </div>
                      <div v-if="hasAndKeywords" class="import-row-card-field">
                        <span class="import-row-card-label">and_keywords</span>
                        <span class="import-row-card-tags">
                          <span class="import-tag import-tag-and" v-for="(k, i) in item.and_keywords" :key="'ca'+i">{{ k }}</span>
                          <span v-if="item.and_keywords.length === 0" class="import-cell-empty">—</span>
                        </span>
                      </div>
                      <div v-if="hasNotKeywords" class="import-row-card-field">
                        <span class="import-row-card-label">not_keywords</span>
                        <span class="import-row-card-tags">
                          <span class="import-tag import-tag-not" v-for="(k, i) in item.not_keywords" :key="'cn'+i">{{ k }}</span>
                          <span v-if="item.not_keywords.length === 0" class="import-cell-empty">—</span>
                        </span>
                      </div>
                    </template>

                    <!-- แผงแก้ไขข้อมูล (เหมือน row-details ของตาราง แต่ใช้กับ card) -->
                    <div v-else class="import-row-edit-panel import-row-edit-panel-card">
                      <div class="import-row-edit-grid">
                        <div class="import-edit-field" v-if="hasDomainName">
                          <label>domain_name</label>
                          <input v-model="editDraft.domain_name" class="import-edit-input" />
                        </div>
                        <div class="import-edit-field" v-if="hasSubdomainName">
                          <label>subdomain_name</label>
                          <input v-model="editDraft.subdomain_name" class="import-edit-input" />
                        </div>
                        <div class="import-edit-field" v-if="hasObjectName">
                          <label>object_name <span class="req">*จำเป็น</span></label>
                          <input v-model="editDraft.object_name" class="import-edit-input" />
                          <span v-if="hasForbiddenChars(editDraft.object_name)" class="import-edit-warning">
                            <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ
                          </span>
                        </div>
                        <div class="import-edit-field" v-if="hasKeywords">
                          <label>keywords</label>
                          <b-form-tags
                            v-model="editDraft.keywords"
                            separator=",;"
                            placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                            add-button-text="เพิ่ม"
                            tag-variant="info"
                            class="import-edit-tags"
                            :tag-validator="tagValidator"
                            invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                          ></b-form-tags>
                        </div>
                        <div class="import-edit-field" v-if="hasAndKeywords">
                          <label>and_keywords</label>
                          <b-form-tags
                            v-model="editDraft.and_keywords"
                            separator=",;"
                            placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                            add-button-text="เพิ่ม"
                            tag-variant="warning"
                            class="import-edit-tags"
                            :tag-validator="tagValidator"
                            invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                          ></b-form-tags>
                        </div>
                        <div class="import-edit-field" v-if="hasNotKeywords">
                          <label>not_keywords</label>
                          <b-form-tags
                            v-model="editDraft.not_keywords"
                            separator=",;"
                            placeholder="พิมพ์แล้ว Enter หรือคั่นด้วย , ；"
                            add-button-text="เพิ่ม"
                            tag-variant="danger"
                            class="import-edit-tags"
                            :tag-validator="tagValidator"
                            invalid-tag-text="ห้ามใส่อักขระพิเศษ"
                          ></b-form-tags>
                        </div>
                      </div>
                      <div class="import-row-edit-actions">
                        <b-button class="import-btn-cancel" size="sm" @click="cancelCardEdit(idx)">ยกเลิก</b-button>
                        <b-button
                          class="import-btn-submit"
                          size="sm"
                          :disabled="!editDraft.object_name || hasForbiddenChars(editDraft.object_name)"
                          @click="saveCardEdit(idx)"
                        >
                          <i class="fa fa-check mr-1"></i> บันทึก
                        </b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="import-empty h-100">
                <b-col cols="12">
                  <i class="fa fa-file-excel"></i>
                </b-col>
                <p>ยังไม่มีไฟล์ที่เลือก — อัปโหลดไฟล์เพื่อดูตัวอย่างข้อมูลก่อนนำเข้า</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มปิด & นำเข้า -->
        <div class="import-footer">
          <b-button class="import-btn-cancel" @click="closeModal">ปิดหน้าต่าง</b-button>
          <b-button
            class="import-btn-submit px-1"
            :disabled="!selectedFile || previewRows.length === 0 || invalidRowCount > 0 || importing"
            @click="importObjects"
          >
            <b-spinner small v-if="importing" class="mr-1"></b-spinner>
            <i v-else class="fa fa-check-circle mr-1"></i>
            นำเข้าข้อมูล ({{ validRowCount }})
          </b-button>
        </div>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from 'sweetalert2'

export default {
  name: "ImportObject",
  props: {
    objectData: { type: Object }
  },
  data() {
    return {
      open: false,
      selectedFile: null,
      previewRows: [],
      importing: false,
      statusMessage: "",
      statusClass: "",
      // ย่อ/ขยายแถบขั้นตอนการนำเข้าฝั่งซ้าย เพื่อเปิดพื้นที่ให้ตารางพรีวิวข้อมูลฝั่งขวา
      sidebarCollapsed: false,
      // index ของแถวที่กำลังแก้ไขอยู่ (เปิด row-details) หรือ null ถ้าไม่ได้แก้ไข
      editingRowIndex: null,
      // ข้อมูลฉบับร่างที่กำลังแก้ไขใน row-details (keyword fields เป็น string คั่นด้วย , ระหว่างแก้)
      editDraft: {
        domain_name: "",
        subdomain_name: "",
        object_name: "",
        keywords: [],
        and_keywords: [],
        not_keywords: [],
      },
    };
  },
  computed: {
    // ดึงชื่อ domain จาก path param ของ route เช่น /setting/อาหารและเครื่องดื่ม?id=673
    // -> domainName = "อาหารและเครื่องดื่ม"
    domainName() {
      return this.$route.params.domain || "";
    },
    // ดึง id ของ domain จาก query string ของ route เช่น ?id=673 -> domainId = "673"
    domainId() {
      return this.$route.query.id || "";
    },
    validRowCount() {
      return this.previewRows.filter(r => r.valid).length;
    },
    invalidRowCount() {
      return this.previewRows.filter(r => !r.valid).length;
    },
    // เช็คทีละคอลัมน์ว่ามีข้อมูลใน previewRows จริงไหม (มาจากไฟล์ที่ผู้ใช้อัปโหลด)
    // ใช้ทั้งกับ previewFields (ซ่อนคอลัมน์ในตาราง) และฟอร์มแก้ไขใน row-details (ซ่อน field เดียวกัน)
    hasDomainName() {
      return this.previewRows.some((row) => String(row.domain_name || "").trim().length > 0);
    },
    hasSubdomainName() {
      return this.previewRows.some((row) => String(row.subdomain_name || "").trim().length > 0);
    },
    hasObjectName() {
      return this.previewRows.some((row) => String(row.object_name || "").trim().length > 0);
    },
    hasKeywords() {
      return this.previewRows.some((row) => Array.isArray(row.keywords) && row.keywords.length > 0);
    },
    hasAndKeywords() {
      return this.previewRows.some((row) => Array.isArray(row.and_keywords) && row.and_keywords.length > 0);
    },
    hasNotKeywords() {
      return this.previewRows.some((row) => Array.isArray(row.not_keywords) && row.not_keywords.length > 0);
    },
    // นิยามคอลัมน์ของ b-table สำหรับตารางพรีวิวข้อมูล
    // ซ่อนคอลัมน์ทิ้งไปเลยถ้าทุกแถวไม่มีข้อมูลในคอลัมน์นั้น (ไม่ใช่แค่ซ่อน cell ว่าง)
    previewFields() {
      const fields = [{ key: "idx", label: "#" }];

      if (this.hasDomainName) {
        fields.push({ key: "domain_name", label: "domain_name" });
      }
      if (this.hasSubdomainName) {
        fields.push({ key: "subdomain_name", label: "subdomain_name" });
      }
      if (this.hasObjectName) {
        fields.push({ key: "object_name", label: "object_name" });
      }
      if (this.hasKeywords) {
        fields.push({ key: "keywords", label: "keywords" });
      }
      if (this.hasAndKeywords) {
        fields.push({ key: "and_keywords", label: "and_keywords" });
      }
      if (this.hasNotKeywords) {
        fields.push({ key: "not_keywords", label: "not_keywords" });
      }

      fields.push({ key: "valid", label: "", tdClass: "import-td-valid" });
      fields.push({ key: "actions", label: "", tdClass: "import-td-actions" });

      return fields;
    },
  },
  watch: {
    open(isOpen) {
      this.$emitter.emit("fullscreenModalToggled", isOpen);
      if (isOpen) {
        this.$nextTick(() => {
          this.hideDefaultCloseButton();
        });
      }
    },
  },
  methods: {
    hideDefaultCloseButton() {
      if (!this.$el) return;
      const shell = this.$el.querySelector(".import-shell");
      if (!shell) return;

      let node = shell.parentElement;
      let modaltorRoot = null;
      while (node && node !== document.body) {
        const position = window.getComputedStyle(node).position;
        if (position === "fixed") {
          modaltorRoot = node;
          break;
        }
        node = node.parentElement;
      }
      if (!modaltorRoot) return;

      const candidates = modaltorRoot.querySelectorAll(
        '[class*="close" i], [class*="exit" i], [class*="header" i]'
      );
      candidates.forEach((el) => {
        if (el.closest(".import-shell")) return;
        el.style.setProperty("display", "none", "important");
      });

      Array.from(modaltorRoot.children).forEach((el) => {
        if (el.contains(shell) || el === shell) return;
        const tag = el.tagName.toLowerCase();
        if (tag === "svg" || tag === "button") {
          el.style.setProperty("display", "none", "important");
        }
      });
    },
    splitKeywords(value) {
      if (!value) return [];
      return String(value)
        .split(/[,;]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
    },
    // ตรวจว่ามีอักขระพิเศษต้องห้ามอยู่ใน string หรือไม่
    // อนุญาตตัวอักษรไทย/อังกฤษ ตัวเลข เว้นวรรค และเครื่องหมาย . - ( )
    // บล็อกสัญลักษณ์พิเศษอื่นๆ เช่น @ _ # $ ฿ % ^ & * , ฯลฯ
    hasForbiddenChars(value) {
      const forbiddenPattern = /[@_#$฿%^&*!~`<>{}[\]|\\/:;"',]/;
      return forbiddenPattern.test(String(value || ""));
    },
    // ใช้กับ b-form-tags prop tag-validator — return false จะปฏิเสธไม่ให้เพิ่ม tag นั้นเลย
    // พร้อมโชว์ข้อความแจ้งเตือน invalid-tag-text ให้อัตโนมัติ (built-in ของ BootstrapVue)
    tagValidator(tag) {
      return !this.hasForbiddenChars(tag);
    },
    // เช็คทั้งแถวว่ามีอักขระต้องห้ามอยู่ใน object_name หรือ keyword ใดๆ บ้างไหม
    rowHasForbiddenChars(row) {
      if (this.hasForbiddenChars(row.object_name)) return true;
      const allKeywords = [
        ...(row.keywords || []),
        ...(row.and_keywords || []),
        ...(row.not_keywords || []),
      ];
      return allKeywords.some((k) => this.hasForbiddenChars(k));
    },
    // เช็คว่าแถวนี้มีข้อมูลอยู่จริงไหม (มีอย่างน้อย 1 คอลัมน์ที่ไม่ว่าง)
    // ใช้กรองแถวที่ไม่มีข้อมูลเลยทุกคอลัมน์ทิ้งไป ไม่ให้ขึ้นในตัวอย่างข้อมูล/นำเข้า
    rowHasAnyData(row) {
      if (!row) return false;
      if (row.domain_name) return true;
      if (row.subdomain_name) return true;
      if (row.object_name) return true;
      if ((row.keywords || []).length > 0) return true;
      if ((row.and_keywords || []).length > 0) return true;
      if ((row.not_keywords || []).length > 0) return true;
      return false;
    },
    // กำหนด class ให้แถวที่ข้อมูลไม่สมบูรณ์ (ใช้กับ b-table tbody-tr-class)
    rowClass(item) {
      if (!item) return "";
      return item.valid ? "" : "row-invalid";
    },
    // ข้อความบอกสาเหตุที่แถวนี้ไม่ valid — เช็คทีละเงื่อนไขตามลำดับความสำคัญ
    invalidReason(item) {
      if (!item) return "";
      if (!item.object_name || item.object_name.length === 0) {
        return "ต้องมี object_name";
      }
      if (!item.subdomain_known) {
        return "ไม่ทราบว่า object นี้อยู่ใน subdomain ไหน (ไม่มีการระบุ subdomain_name ไว้ก่อนหน้าในกลุ่ม domain นี้)";
      }
      if (this.rowHasForbiddenChars(item)) {
        return "มีอักขระพิเศษต้องห้าม (เช่น @ _ # $ % , ) อยู่ใน object_name หรือ keyword";
      }
      return "ข้อมูลไม่สมบูรณ์";
    },
    // เปิด/ปิดแผงแก้ไขของแถว (b-table row-details) ผ่าน row.toggleDetails ตาม API ของ BootstrapVue
    // ปิดแถวอื่นก่อนเปิดแถวใหม่เสมอ เพื่อไม่ให้มีฟอร์มแก้ไขค้างหลายแถวพร้อมกัน
    toggleRowEdit(row) {
      const opening = !row.detailsShowing;

      if (opening) {
        this.previewRows.forEach((r, i) => {
          if (i !== row.index) {
            this.$set(r, "_showDetails", false);
          }
        });
        this.startRowEdit(row.index);
      } else {
        this.editingRowIndex = null;
      }

      row.toggleDetails();
    },
    // เวอร์ชันสำหรับ card view (จอเล็ก) — ทำงานแบบเดียวกับ toggleRowEdit
    // แต่ไม่ต้องพึ่ง row scoped-slot object ของ b-table เพราะ card ไม่ได้ผ่าน b-table
    toggleCardEdit(idx) {
      const row = this.previewRows[idx];
      if (!row) return;
      const opening = this.editingRowIndex !== idx;

      this.previewRows.forEach((r, i) => {
        this.$set(r, "_showDetails", i === idx && opening);
      });

      if (opening) {
        this.startRowEdit(idx);
      } else {
        this.editingRowIndex = null;
      }
    },
    // เก็บค่าปัจจุบันของแถวมาใส่ในฟอร์มร่างก่อนเปิดแก้ไข
    startRowEdit(rowIdx) {
      const row = this.previewRows[rowIdx];
      if (!row) return;
      this.editingRowIndex = rowIdx;
      this.editDraft = {
        domain_name: row.domain_name,
        subdomain_name: row.subdomain_name,
        object_name: row.object_name,
        // clone array ออกมาต่างหาก ไม่ผูกกับ array เดิมของ row ตรงๆ
        // เพราะ b-form-tags แก้ไข array ที่ผูกอยู่โดยตรง ถ้าไม่ clone จะกระทบ
        // ข้อมูลจริงใน previewRows ทันทีก่อนกด "บันทึก" (กด "ยกเลิก" จะไม่ revert ค่าคืน)
        keywords: [...row.keywords],
        and_keywords: [...row.and_keywords],
        not_keywords: [...row.not_keywords],
      };
    },
    // บันทึกฟอร์มร่างกลับเข้า previewRows แล้วคำนวณ valid ใหม่ จากนั้นปิดแผงแก้ไข
    // บันทึกค่าจาก editDraft กลับเข้า row object เป้าหมาย แล้วคำนวณ valid ใหม่
    // (logic ส่วนกลางที่ทั้ง table view และ card view เรียกใช้ร่วมกัน)
    applyEditDraftTo(target) {
      target.domain_name = String(this.editDraft.domain_name || "").trim();
      target.subdomain_name = String(this.editDraft.subdomain_name || "").trim();
      target.object_name = String(this.editDraft.object_name || "").trim();
      target.keywords = [...this.editDraft.keywords];
      target.and_keywords = [...this.editDraft.and_keywords];
      target.not_keywords = [...this.editDraft.not_keywords];
      // ✅ ถ้าผู้ใช้กรอก subdomain_name เองในฟอร์มแก้ไข ถือว่ารู้จัก subdomain นี้แล้วทันที
      // แต่ถ้าลบออกจนว่าง ให้คงค่า subdomain_known เดิมไว้ (อาจ inherit มาจาก hierarchy ตอน parse ไฟล์)
      if (target.subdomain_name.length > 0) {
        target.subdomain_known = true;
      }
      // ✅ ต้องมี object_name เสมอ (ยกเว้นแถวไม่มีข้อมูลเลย ซึ่งจะถูกตัดออกจาก preview ไปแล้ว)
      // ต้องไม่มีอักขระพิเศษต้องห้ามอยู่ใน object_name หรือ keyword ใดๆ
      // และต้องรู้ว่า object นี้อยู่ subdomain ไหน (subdomain_known ต้องเป็น true)
      target.valid =
        target.object_name.length > 0 && !!target.subdomain_known && !this.rowHasForbiddenChars(target);
    },
    saveRowEdit(row) {
      const target = this.previewRows[row.index];
      if (!target) return;
      this.applyEditDraftTo(target);
      this.editingRowIndex = null;
      row.toggleDetails();
      // ✅ ถ้าแก้แล้วทุกคอลัมน์ว่างหมด ถือว่าไม่มีข้อมูล ให้ตัดแถวนี้ออกจากตัวอย่างข้อมูลไปเลย
      if (!this.rowHasAnyData(target)) {
        this.removeRow(row.index);
      }
    },
    cancelRowEdit(row) {
      this.editingRowIndex = null;
      row.toggleDetails();
    },
    // เวอร์ชัน card view ของ save/cancel — ทำงานแบบเดียวกันแต่ไม่ต้องพึ่ง row.toggleDetails()
    saveCardEdit(idx) {
      const target = this.previewRows[idx];
      if (!target) return;
      this.applyEditDraftTo(target);
      this.editingRowIndex = null;
      this.$set(target, "_showDetails", false);
      // ✅ ถ้าแก้แล้วทุกคอลัมน์ว่างหมด ถือว่าไม่มีข้อมูล ให้ตัดแถวนี้ออกจากตัวอย่างข้อมูลไปเลย
      if (!this.rowHasAnyData(target)) {
        this.removeRow(idx);
      }
    },
    cancelCardEdit(idx) {
      this.editingRowIndex = null;
      const target = this.previewRows[idx];
      if (target) {
        this.$set(target, "_showDetails", false);
      }
    },
    // ลบแถวออกจากตัวอย่างข้อมูล (ก่อนนำเข้าจริง)
    removeRow(rowIdx) {
      this.previewRows.splice(rowIdx, 1);
      if (this.editingRowIndex === rowIdx) {
        this.editingRowIndex = null;
      } else if (this.editingRowIndex !== null && this.editingRowIndex > rowIdx) {
        // index ของแถวที่กำลังแก้ไขเลื่อนขึ้นมา 1 เพราะลบแถวก่อนหน้าไป
        this.editingRowIndex -= 1;
      }
    },
    // สร้างไฟล์ Excel ใหม่จาก previewRows ปัจจุบัน (รวมการแก้ไข/ลบแถวที่ผู้ใช้ทำในตัวอย่างข้อมูล)
    // จำเป็นต้องทำแบบนี้เพราะตอนนำเข้าจริง เราส่ง "ไฟล์" ทั้งไฟล์ไปให้ backend parse เอง
    // (ไม่ได้ส่งทีละแถวแบบ JSON) ถ้าส่ง this.selectedFile ตรงๆ จะเป็นไฟล์ต้นฉบับที่ยังไม่ถูกแก้ไข/ลบแถวเลย
    buildExcelFileFromPreviewRows() {
      const rows = this.previewRows.map((row) => ({
        domain_name: row.domain_name || "",
        subdomain_name: row.subdomain_name || "",
        object_name: row.object_name || "",
        keywords: (row.keywords || []).join(", "),
        and_keywords: (row.and_keywords || []).join(", "),
        not_keywords: (row.not_keywords || []).join(", "),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: [
          "domain_name",
          "subdomain_name",
          "object_name",
          "keywords",
          "and_keywords",
          "not_keywords",
        ],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const originalName = this.selectedFile ? this.selectedFile.name : "template_domain.xlsx";
      return new File([arrayBuffer], originalName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    },
    closeModal() {
      this.open = false;
      this.clearForm();
    },
    clearForm() {
      this.clearFile();
    },
    downloadTemplate() {
      const link = document.createElement("a");
      link.href = "/template_domain.xlsx";
      link.download = "template_domain.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onNativeFileChange(e) {
      const file = e.target.files && e.target.files[0];
      this.handleFile(file);
    },
    onFileDrop(e) {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      this.handleFile(file);
    },
    clearFile() {
      this.selectedFile = null;
      this.previewRows = [];
      this.statusMessage = "";
      this.statusClass = "";
      this.editingCell = null;
      this.editValue = "";
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    handleFile(file) {
      this.previewRows = [];
      this.statusMessage = "";
      this.editingCell = null;
      this.editValue = "";
      if (!file) return;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // ✅ ตรวจหัวคอลัมน์ก่อน parse เป็นข้อมูลจริง เพื่อจับไฟล์ที่ format ไม่ตรง template
          // (เช่น เปลี่ยนชื่อคอลัมน์, สลับลำดับ sheet, หรืออัปโหลดไฟล์คนละชนิดมาเลย)
          const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" })[0] || [];
          const headerCheck = this.validateTemplateHeaders(headerRow);

          if (!headerCheck.ok) {
            this.previewRows = [];
            this.statusMessage = "";
            // เคลียร์ไฟล์ที่เลือกออกด้วย เพราะไม่สามารถนำเข้าได้จริงตาม format นี้
            this.selectedFile = null;
            if (this.$refs.fileInput) {
              this.$refs.fileInput.value = "";
            }
            this.$fire({
              title: "ไฟล์ไม่ตรงตามรูปแบบ Template",
              text: headerCheck.message,
              type: "error",
              confirmButtonText: "ตกลง",
            });
            return;
          }

          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          // ✅ ไฟล์ Excel มักกรอก domain_name/subdomain_name แค่แถวแรกของแต่ละกลุ่ม
          // (เหมือนตาราง merge cell) แถวถัดไปเว้นว่างไว้ — ต้อง "เติม" ค่าจากแถวบนลงมาให้
          // เพื่อให้รู้ว่าแต่ละแถวอยู่ domain/subdomain ไหนจริงๆ
          let currentDomainName = "";
          let currentSubdomainName = "";
          // ติดตามว่า subdomain ของ domain ปัจจุบัน "เคยถูกระบุมาก่อน" ไหม
          // ถ้า domain หนึ่งขึ้นกลุ่มใหม่มาแล้วยังไม่เคยมี subdomain_name เลยสักแถว
          // ถือว่าไม่รู้ว่า object อยู่ subdomain ไหน -> invalid ตั้งแต่แถวแรกของ domain นั้น
          let subdomainKnownForCurrentDomain = false;

          this.previewRows = rows
            .map((row) => {
              const rawDomainName = String(row.domain_name || "").trim();
              const rawSubdomainName = String(row.subdomain_name || "").trim();
              const object_name = String(row.object_name || "").trim();
              const keywords = this.splitKeywords(row.keywords);
              const and_keywords = this.splitKeywords(row.and_keywords);
              const not_keywords = this.splitKeywords(row.not_keywords);

              // ขึ้น domain ใหม่เมื่อมีการระบุ domain_name มาในแถวนี้ (ไม่ว่าง)
              // -> รีเซ็ตสถานะ "รู้จัก subdomain" ใหม่ทุกครั้งที่เจอ domain ใหม่
              if (rawDomainName.length > 0) {
                currentDomainName = rawDomainName;
                currentSubdomainName = "";
                subdomainKnownForCurrentDomain = false;
              }

              // กรณี domain_name และ subdomain_name ของแถวนี้ว่างทั้งคู่ (เหมือน merge cell ต่อเนื่อง)
              // -> inherit subdomain_name จากแถวก่อนหน้าได้
              // แต่ถ้าแถวนี้มีการระบุ domain_name มาใหม่ (ขึ้นกลุ่มใหม่) แม้ subdomain_name จะว่าง
              // ก็ไม่ inherit ของกลุ่มก่อนหน้ามาให้ ต้องถือว่ายังไม่รู้จัก subdomain จนกว่าจะมีการระบุจริง
              let subdomain_name;
              if (rawSubdomainName.length > 0) {
                currentSubdomainName = rawSubdomainName;
                subdomainKnownForCurrentDomain = true;
                subdomain_name = rawSubdomainName;
              } else if (rawDomainName.length === 0 && subdomainKnownForCurrentDomain) {
                // ทั้ง domain_name และ subdomain_name ว่างคู่กัน และเคยรู้จัก subdomain ของกลุ่มนี้แล้ว
                subdomain_name = currentSubdomainName;
              } else {
                // ยังไม่เคยรู้จัก subdomain ของ domain นี้เลย (รวมถึงแถวแรกของ domain ที่ไม่มี subdomain_name)
                subdomain_name = "";
              }

              const domain_name = currentDomainName;
              // ระบุไว้ในแต่ละแถวว่า ณ จุดนี้ subdomain ของ domain ปัจจุบัน รู้จักแล้วหรือยัง
              // ใช้ตัดสิน valid ของแถวนี้ (ไม่ใช้ subdomain_name.length อย่างเดียว เพราะ subdomain_name
              // ที่ inherit มาได้ก็ต้องนับว่ารู้จักด้วย ซึ่งจัดการไว้แล้วข้างบน)
              const subdomain_known = subdomainKnownForCurrentDomain;

              return {
                domain_name,
                subdomain_name,
                subdomain_known,
                object_name,
                keywords,
                and_keywords,
                not_keywords,
                // ✅ ต้องมี object_name เสมอ ยกเว้นแถวที่ไม่มีข้อมูลเลยทุกคอลัมน์
                // (แถวไม่มีข้อมูลเลยจะถูกตัดออกด้วย .filter ด้านล่างอยู่แล้ว ไม่ถือว่า valid)
                // ต้องไม่มีอักขระพิเศษต้องห้ามอยู่ใน object_name หรือ keyword ใดๆ
                // และต้องรู้ว่า object นี้อยู่ subdomain ไหน (subdomain_known ต้องเป็น true)
                valid:
                  object_name.length > 0 &&
                  subdomain_known &&
                  !this.hasForbiddenChars(object_name) &&
                  ![...keywords, ...and_keywords, ...not_keywords].some((k) => this.hasForbiddenChars(k)),
                // เริ่มต้นไว้ตั้งแต่แรกเพื่อให้ Vue 2 reactivity ตรวจจับการเปลี่ยนแปลงได้แน่นอน
                // (ตาม BootstrapVue docs: ต้องมี property นี้อยู่แล้วใน item ถ้าจะแก้ไขตรงๆ)
                _showDetails: false,
              };
            })
            // ✅ ตัดแถวที่ไม่มีข้อมูลเลยทุกคอลัมน์ออก (มักเป็นแถวว่างที่หลุดมาจากไฟล์ Excel)
            // ถือว่า "ไม่มีข้อมูล" เมื่อทุกคอลัมน์ว่างหมด ไม่ใช่แค่ object_name ว่างอย่างเดียว
            .filter((row) => this.rowHasAnyData(row));

          if (this.previewRows.length === 0) {
            this.statusMessage = "ไม่พบข้อมูลในไฟล์ที่อัปโหลด";
            this.statusClass = "warning";
          } else if (headerCheck.warning) {
            // ไฟล์ใช้นำเข้าได้ แต่มีคอลัมน์ที่ระบบไม่รู้จักปนมาด้วย แจ้งเตือนไว้เฉยๆ ไม่บล็อก
            this.statusMessage = headerCheck.warning;
            this.statusClass = "warning";
          }
        } catch (error) {
          console.error("Error parsing file:", error);
          this.statusMessage = "";
          this.$fire({
            title: "ไม่สามารถอ่านไฟล์ได้",
            text: "กรุณาตรวจสอบรูปแบบไฟล์ตาม Template",
            type: "error",
            confirmButtonText: "ตกลง",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    },
    // ตรวจหัวคอลัมน์ของไฟล์ที่อัปโหลด เทียบกับคอลัมน์ของ template_domain.xlsx แบบเป๊ะๆ
    // - ต้องมีคอลัมน์ครบทุกตัวตาม template (domain_name, subdomain_name, object_name,
    //   keywords, and_keywords, not_keywords) ถ้าขาดคอลัมน์ใดไป -> ไม่ให้นำเข้า (ok: false)
    // - ถ้ามีคอลัมน์แปลกปลอมที่ไม่ได้อยู่ใน template ปนมาด้วย -> ก็ถือว่าไฟล์ไม่ตรง template เช่นกัน (ok: false)
    validateTemplateHeaders(headerRow) {
      // ลำดับคอลัมน์อ้างอิงตาม template_domain.xlsx — ใช้ทั้งเช็คคอลัมน์ที่ขาด/เกิน
      const templateColumns = ["domain_name", "subdomain_name", "object_name", "keywords", "and_keywords", "not_keywords"];

      const headers = (headerRow || [])
        .map((h) => String(h || "").trim())
        .filter((h) => h.length > 0);

      if (headers.length === 0) {
        return {
          ok: false,
          message: "ไม่พบหัวคอลัมน์ในไฟล์ — กรุณาตรวจสอบว่าไฟล์ตรงตาม Template (ดาวน์โหลด Template ใหม่ได้ที่ปุ่มด้านบน)",
        };
      }

      const missingColumns = templateColumns.filter((col) => !headers.includes(col));
      const extraColumns = headers.filter((h) => !templateColumns.includes(h));

      if (missingColumns.length > 0 || extraColumns.length > 0) {
        const parts = [];
        if (missingColumns.length > 0) {
          parts.push(`ขาดคอลัมน์: ${missingColumns.join(", ")}`);
        }
        if (extraColumns.length > 0) {
          parts.push(`มีคอลัมน์ที่ไม่ตรงกับ Template: ${extraColumns.join(", ")}`);
        }
        return {
          ok: false,
          message:
            `ไฟล์นี้มีคอลัมน์ไม่ตรงตามรูปแบบ Template ที่ระบบรองรับ (${parts.join(" / ")}) ` +
            `กรุณาดาวน์โหลด Template ใหม่และกรอกข้อมูลตามคอลัมน์ที่กำหนดเท่านั้น`,
        };
      }

      return { ok: true, warning: null };
    },
    async importObjects() {
      if (!this.selectedFile) {
        this.$fire({
          title: "ไม่พบไฟล์ที่จะนำเข้า",
          text: "กรุณาเลือกไฟล์ก่อน",
          type: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      if (this.previewRows.length === 0) {
        this.$fire({
          title: "ไม่มีข้อมูลที่จะนำเข้า",
          text: "อาจถูกลบออกจากตัวอย่างข้อมูลหมดแล้ว",
          type: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      // ✅ กันไว้อีกชั้นนอกเหนือจาก disabled ของปุ่ม — ห้ามนำเข้าถ้ายังมีแถวข้อมูลไม่สมบูรณ์อยู่
      // ต้องแก้ไขให้ทุกแถว valid ก่อน ถึงจะนำเข้าทั้งไฟล์ได้
      if (this.invalidRowCount > 0) {
        this.$fire({
          title: "มีข้อมูลไม่สมบูรณ์",
          text: `พบ ${this.invalidRowCount} แถวที่ข้อมูลไม่ครบหรือไม่ถูกต้อง กรุณาแก้ไขให้ครบก่อนนำเข้า`,
          type: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      this.importing = true;
      this.statusMessage = "";

      // ✅ สร้างไฟล์ใหม่จาก previewRows ปัจจุบัน ไม่ใช่ไฟล์ต้นฉบับ
      // เพื่อให้แถวที่ผู้ใช้ลบ/แก้ไขในตัวอย่างข้อมูล มีผลจริงตอนนำเข้า
      const fileToUpload = this.buildExcelFileFromPreviewRows();

      const formData = new FormData();
      formData.append("file", fileToUpload);

      try {
        await axios.post(
          "https://api2.cognizata.com/api/v2/setting/importDomainExcel",
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$store.dispatch("resetDomainLastUpdate", this.domainId);
        this.$emitter.emit("callApiListSubdomain");

        this.clearForm();
        this.closeModal();
        this.$fire({
          title: "นำเข้าข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error importing excel:", error.response?.data || error);
        this.statusMessage = "";
        this.$fire({
          title: "นำเข้าข้อมูลไม่สำเร็จ",
          text: error.response?.data?.message || "กรุณาตรวจสอบไฟล์แล้วลองอีกครั้ง",
          type: "error",
          confirmButtonText: "ตกลง",
        });
      } finally {
        this.importing = false;
      }
    },
  },
};
</script>

<style scoped>
::v-deep .import-fullscreen-modal .modal-vue--content.space-content {
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    overflow: hidden;
}
.import-shell {
  display: flex;
  flex-direction: column;
  height: 95vh;
  background: #f7f9fa;
}

.import-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  /* padding: 10px 10px; */
  background: #ffffff;
  border-bottom: 1px solid #e7ecee;
  gap: 12px;
}

.import-topbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 700;
  color: #2c3e50;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.import-topbar-title i {
  color: #50c1d0;
  font-size: 20px;
}

.import-close-btn {
  border: none;
  background: transparent;
  color: #8a949c;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.import-close-btn:hover {
  background: #f0f2f4;
  color: #2c3e50;
}

.import-body {
  flex: 1;
  display: flex;
  min-height: 0;
 
}

.import-side {
  width: 340px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e7ecee;
  overflow-y: auto;
  transition: width .2s ease;
}

.import-side.is-collapsed {
  width: 44px;
  overflow: hidden;
}

.import-side.is-collapsed .import-side-inner {
  padding: 14px 8px;
}

.import-side-toggle-row {
  margin-bottom: 4px;
}

.import-side-toggle {
  border: none;
  background: #f0f2f4;
  color: #6b757a;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 12px;
  transition: background .15s ease, color .15s ease;
}

.import-side-toggle:hover {
  background: #50c1d0;
  color: #ffffff;
}

.import-side-inner {
  padding: 28px 24px;
}

.import-side-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #9aa5ab;
  margin-bottom: 18px;
}

.import-step {
  display: flex;
  gap: 14px;
  padding-bottom: 22px;
  position: relative;
}

.import-step:not(:last-of-type)::before {
  content: "";
  position: absolute;
  left: 14px;
  top: 30px;
  bottom: 0;
  width: 2px;
  background: #e7ecee;
}

.import-step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eef3f4;
  color: #8a949c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  z-index: 1;
  transition: background .2s ease, color .2s ease;
}

.import-step.is-done .import-step-num {
  background: #50c1d0;
  color: #ffffff;
}

.import-step-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 14.5px;
  margin-bottom: 2px;
}

.import-step-desc {
  font-size: 13px;
  color: #7c878d;
  line-height: 1.5;
}

.import-template-btn {
  background: #fdf3df !important;
  color: #946c25 !important;
  border: 1px solid #f3d8a3 !important;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  padding: 6px 14px;
}

.import-template-btn:hover {
  background: #fdd071 !important;
  color: #6b4f1c !important;
}

.import-columns-card {
  margin-top: 8px;
  padding: 16px;
  background: #f7f9fa;
  border: 1px solid #e7ecee;
  border-radius: 10px;
}

.import-columns-title {
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.import-columns-title i {
  color: #50c1d0;
}

.import-columns-list {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #4d5a61;
}

.import-columns-list code {
  background: #ffffff;
  border: 1px solid #e3e8ea;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  color: #2c3e50;
}

.import-columns-list .req {
  color: #d98a00;
  font-size: 11px;
  margin-left: 4px;
}

.import-columns-note {
  font-size: 12px;
  color: #9aa5ab;
  margin: 0;
}

.import-columns-note code {
  background: #ffffff;
  border: 1px solid #e3e8ea;
  border-radius: 4px;
  padding: 0 5px;
}

.import-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  position: relative;
}

.import-main-inner {
  flex: 1;
  min-height: 0;
  padding: 10px;
}

.import-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  border: 2px dashed #c9d6da;
  border-radius: 14px;
  padding: 22px 16px;
  background: #ffffff;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
  width: 100%;
  margin-top: 8px;
}

.import-dropzone:hover {
  border-color: #50c1d0;
  background: #f4fbfc;
}

.import-dropzone.has-file {
  border-style: solid;
  border-color: #50c1d0;
  background: #f4fbfc;
}

.import-dropzone-input {
  display: none;
}

.import-dropzone-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #eaf7f9;
  color: #50c1d0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.import-dropzone-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.import-dropzone-text strong {
  color: #2c3e50;
  font-size: 15px;
  word-break: break-all;
}

.import-dropzone-text span {
  font-size: 12.5px;
  color: #9aa5ab;
}

.import-dropzone-clear {
  background: #ffffff !important;
  border: 1px solid #d9dee0 !important;
  color: #7c878d !important;
  font-size: 12px;
  border-radius: 8px;
  flex-shrink: 0;
}

.import-dropzone-clear:hover {
  border-color: #d96a6a !important;
  color: #d96a6a !important;
}

.import-empty {
  max-width: 100%;
  height: 100%;
  margin-top: 18px;
  padding: 40px 20px;
  text-align: center;
  color: #b9c1c5;
}

.import-empty i {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}

.import-empty p {
  font-size: 13.5px;
  margin: 0;
}

.import-preview {
  margin-top: 5px;
}

.import-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #4d5a61;
  margin-bottom: 10px;
}

.import-preview-header i {
  color: #50c1d0;
  margin-right: 6px;
}

.import-preview-hint {
  color: #9aa5ab;
  font-size: 12.5px;
  font-weight: 400;
}

.import-preview-warning {
  color: #c47a00;
  font-size: 13px;
  background: #fff6e6;
  border: 1px solid #f3dca6;
  padding: 4px 10px;
  border-radius: 20px;
}

.preview-table-wrapper {
  max-height: 65vh;
  /* min-height: 160px; */
  overflow: auto;
  border: 1px solid #e7ecee;
  border-radius: 10px;
  background: #ffffff;
}

/* Card view: ซ่อนไว้ก่อนเป็น default (จอใหญ่ใช้ตาราง) เปิดใช้ที่ breakpoint มือถือด้านล่าง */
.import-card-view {
  display: none;
}

.import-row-card {
  border: 1px solid #e7ecee;
  border-radius: 10px;
  background: #ffffff;
  padding: 14px;
  margin-bottom: 10px;
}

.import-row-card.row-invalid {
  background: #fff8f3;
  border-color: #f3dca6;
}

.import-row-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.import-row-card-index {
  font-weight: 700;
  font-size: 13px;
  color: #6b757a;
}

.import-row-card-actions {
  margin-left: auto;
  display: flex;
  gap: 2px;
}

.import-row-card-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 0;
  border-top: 1px solid #f0f2f4;
}

.import-row-card-field:first-of-type {
  border-top: none;
}

.import-row-card-label {
  font-size: 11px;
  font-weight: 700;
  color: #9aa5ab;
  text-transform: uppercase;
  letter-spacing: .03em;
}

.import-row-card-value {
  font-size: 13.5px;
  color: #2c3e50;
}

.import-row-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.import-row-edit-panel-card {
  border-top: none;
  border-bottom: none;
  padding: 8px 0 0;
  background: transparent;
}

.import-table {
  margin-bottom: 0;
  font-size: 13px;
}

.import-table thead th {
  position: sticky;
  top: 0;
  background: #f7f9fa;
  color: #6b757a;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .03em;
  border-bottom: 1px solid #e7ecee;
  white-space: nowrap;
}

.import-table tbody tr.row-invalid {
  background: #fff8f3;
}

.import-tag {
  display: inline-block;
  background: #eef6f8;
  color: #2c3e50;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 11.5px;
  margin: 2px 3px 2px 0;
}

.import-tag-and {
  background: #fff6e6;
  color: #8a5d00;
}

.import-tag-not {
  background: #fdecec;
  color: #a23a3a;
}

.import-row-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 22px;
  height: 22px;
  padding: 0 4px;
  border-radius: 11px;
  font-size: 11px;
  white-space: nowrap;
}

.import-row-status.fail {
  width: 22px;
  padding: 0;
  border-radius: 50%;
  background: #fdecec;
  color: #c0392b;
  cursor: help;
}

.import-row-status.ok {
  background: #e6f7ed;
  color: #2f9e5b;
}

.import-row-status.editing {
  background: #eaf7f9;
  color: #50c1d0;
  cursor: help;
  animation: import-status-pulse 1.4s ease-in-out infinite;
}

@keyframes import-status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.import-cell-empty {
  color: #c3cbcf;
  font-style: italic;
}

.import-row-edit,
.import-row-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #c3cbcf;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.import-row-edit:hover {
  background: #eaf7f9;
  color: #50c1d0;
}

.import-row-delete:hover {
  background: #fdecec;
  color: #c0392b;
}

.import-td-valid {
  white-space: nowrap;
  width: 36px;
  text-align: center;
}

.import-td-actions {
  white-space: nowrap;
  width: 76px;
}

.import-td-actions .import-row-edit,
.import-td-actions .import-row-delete {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 4px;
}

.import-td-actions .import-row-delete {
  margin-right: 0;
}

/* Row-details edit panel */
.import-row-edit-panel {
  background: #f7f9fa;
  border-top: 1px solid #e7ecee;
  border-bottom: 2px solid #50c1d0;
  padding: 18px 20px;
}

.import-row-edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.import-edit-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.import-edit-field label {
  font-size: 12px;
  font-weight: 700;
  color: #6b757a;
}

.import-edit-field label .req {
  color: #d98a00;
  font-weight: 600;
  font-size: 11px;
}

.import-edit-input {
  width: 100%;
  border: 1px solid #d9dee0;
  border-radius: 7px;
  padding: 7px 10px;
  font-size: 13.5px;
  font-family: inherit;
  color: #2c3e50;
  background: #ffffff;
  outline: none;
  transition: border-color .15s ease;
}

.import-edit-input:focus {
  border-color: #50c1d0;
}

.import-edit-tags {
  border-radius: 7px;
}

.import-edit-warning {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #c0392b;
  margin-top: 2px;
}

.import-row-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.import-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 15px;
  background: #ffffff;
  border-top: 1px solid #e7ecee;
}

.import-btn-cancel {
  background: #ffffff !important;
  border: 1px solid #d9dee0 !important;
  color: #5b656a !important;
  font-weight: 600;
  border-radius: 9px;
  padding: 8px 20px;
}

.import-btn-cancel:hover {
  background: #f4f5f6 !important;
}

.import-btn-submit {
  background: #50c1d0 !important;
  border: 1px solid #50c1d0 !important;
  color: #1d3a40 !important;
  font-weight: 700;
  border-radius: 9px;
  padding: 8px 22px;
}

.import-btn-submit:disabled {
  background: #d8e7e9 !important;
  border-color: #d8e7e9 !important;
  color: #9bb0b3 !important;
}

.import-btn-submit:not(:disabled):hover {
  background: #41acba !important;
  border-color: #41acba !important;
}

/* Tablet */
@media only screen and (min-width: 769px) and (max-width: 991px) {
  .import-side {
    width: 280px;
  }
  .import-main-inner {
    padding: 24px 20px 8px;
  }
  .import-table-view {
    display: none;
  }
  .import-card-view {
    display: block;
  }
}

/* Mobile: stack side + main vertically, single scroll container */
@media only screen and (max-width: 768px) {
  .btn-importobj {
    font-size: 12px !important;
  }
  .import-topbar {
    padding: 14px 16px;
  }
  .import-topbar-title {
    font-size: 16px;
    gap: 8px;
  }
  .import-topbar-title i {
    font-size: 17px;
  }
  .import-body {
    flex-direction: column;
    overflow-y: auto;
  }
  .import-side {
    width: 100%;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid #e7ecee;
    /* ปิด scroll ของตัวเอง เพราะ .import-body เป็น scroll container เดียวตอน stack แนวตั้ง
       ถ้าเปิดทั้งคู่จะเกิด scroll ซ้อนกัน 2 ชั้น ทำให้ความสูงคำนวณผิดและดูเหมือน layout พัง */
    overflow-y: visible;
  }
  .import-side.is-collapsed {
    /* บนมือถือ sidebar วางซ้อนแนวตั้ง (column) การย่อความกว้างแบบ desktop ไม่เหมาะ
       เลยให้ย่อเหลือแค่แถบบางๆ เต็มความกว้างแทน */
    width: 100%;
  }
  .import-side-inner {
    padding: 20px 16px;
  }
  .import-main {
    min-height: 0;
  }
  /* ✅ จอเล็ก: ซ่อนตาราง แสดงเป็นการ์ดแทน เพราะตารางหลายคอลัมน์
     อ่าน/ใช้งานยากบนจอแคบ แม้จะ scroll แนวนอนได้ก็ตาม */
  .import-table-view {
    display: none;
  }
  .import-card-view {
    display: block;
  }
  .import-main-inner {
    padding: 10px;
  }
  .import-dropzone {
    flex-direction: column;
    text-align: center;
    padding: 18px 14px;
  }
  .import-columns-card {
    padding: 14px;
  }
  .preview-table-wrapper {
    max-height: 40vh;
  }
  .import-row-edit-panel {
    padding: 14px 16px;
  }
  .import-row-edit-grid {
    grid-template-columns: 1fr;
  }
  .import-footer {
    padding: 14px 16px;
    gap: 8px;
  }
  .import-btn-cancel,
  .import-btn-submit {
    padding: 8px 14px;
    font-size: 13.5px;
  }
}

/* Small phones */
@media only screen and (max-width: 420px) {
  .import-topbar-title {
    font-size: 14.5px;
  }
  .import-footer {
    flex-wrap: wrap;
  }
  .import-footer .import-btn-cancel,
  .import-footer .import-btn-submit {
    flex: 1;
    text-align: center;
  }
}

::v-deep .import-fullscreen-modal {
  z-index: 2000 !important;
  overflow: hidden;
}
::v-deep modal-vue-panel modal-slide-top modal-vue-show{
  overflow-y: hidden !important;
}
::v-deep .import-fullscreen-modal .modaltor__overlay {
  z-index: 2000 !important;
}

::v-deep .import-fullscreen-modal .modaltor__panel {
  width: 90vw !important;
  max-width: 90vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  z-index: 2001 !important;
}

::v-deep .import-fullscreen-modal .modaltor__panel--show {
  transform: translateY(0) !important;
}

::v-deep .import-fullscreen-modal .modaltor__content {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .import-fullscreen-modal .modaltor__header {
  display: none !important;
}

::v-deep .import-fullscreen-modal .modaltor__close {
  display: none !important;
}
</style>

<style>
.import-fullscreen-modal .modaltor__header,
.import-fullscreen-modal .modaltor__close {
  display: none !important;
}

.import-fullscreen-modal {
  z-index: 2000 !important;
}
</style>