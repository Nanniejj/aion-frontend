<!-- FacePersonSelect.vue -->
<template>
    <div class="my-5">
        
        <v-select class="mt-2 mb-3" :options="options" label="text" :reduce="p => p.value" v-model="selectedProxy"
            :placeholder="loading ? 'กำลังดึงข้อมูล...' : 'เลือกบุคคล'" :disabled="loading || options.length === 0">
            <template v-slot:option="option">
                <div class="my-1">
                <b-avatar :src="option.photo" size="65px"></b-avatar>
                {{ option.text }}</div>
            </template>
        </v-select>
        
    </div>
</template>

<script>
// Vue 2: import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
    components: { vSelect },
    props: {
    },
    data() {
        return {
            options: [],       // [{ value: id, text: name }]
            nameQuery: this.defaultName,
            page: 1,
            loading: false,
            error: null,
            debounceTimer: null
        }
    },

    computed: {

    },

    methods: {

        async fetchOptions() {
            this.loading = true
            this.error = null
            try {
                const baseURL = 'https://api2.cognizata.com/api/v2/facerecognition/getFacePerson'
                const params = {}
                params.limit = 'all'
                if (this.page) params.page = this.page
                if (this.nameQuery && this.nameQuery.trim()) params.name = this.nameQuery.trim()
                if (this.lockedId) params.id = this.lockedId

                const res = await axios.get(baseURL, {
                    params,
                    headers: this.authToken ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : undefined
                })
                // ปรับ mapping ให้ตรง response จริง
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
                this.options = list.map(person => ({
                    value: person._id || person.id,
                    text: person.name || person.fullname || `${person.firstName || ''} ${person.lastName || ''}`.trim(),
                    photo: person.image_paths[0] || person.image_paths[1] ||null
                }))

                // ถ้าค่าที่ parent ส่งมาไม่อยู่ในหน้าใหม่ ให้ reset (กันหลงหน้า)
                const exists = this.options.some(o => o.value === this.value)
                if (!exists) this.$emit('input', null)
            } catch (err) {
                this.error = err?.response?.data?.message || err.message || 'ดึงข้อมูลไม่สำเร็จ'
                this.options = []
            } finally {
                this.loading = false
            }
        }
    },
    mounted() {
        this.fetchOptions()
    },
}
</script>

<style scoped>
button:disabled {
    opacity: .6;
    cursor: not-allowed;
}
</style>
