<template>
    <div class="tagSelectorWrapper">
        <div class="inputWrapper">
            <input type="text" v-model="inputText" @keyup.arrow-down="onArrowDown" @keyup.arrow-up="onArrowUp" @keyup.enter="onEnter">
            <div v-if="candidateTags.length != 0" class="candidateWrapper">
                <div v-for="tag in candidateTags" :key="tag.id" :style="highlightIfSelected(tag)" @mouseover="onHover(tag)" @click="addTag(tag)">
                    {{ tag.name }}
                </div>
            </div>
        </div>
        <div class="selectedTagsWrapper">
            <div v-for="tag in selectedTags" :key="tag.name" class="selectedTag">
                <span>{{ tag.name }}</span>
                <span class="selectedTag-deleteButton" @click="deleteFromSelectedTag(tag)">x</span>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
    props: [ 'tags' ],
    mounted() {
        this.selectedTags = this.tags;
    },
    data() {
        return {
            inputText: '',
            candidateTags: [],
            selectedCandidateIndex: -1,
            selectedTags: []
        }
    },
    watch: {
        async inputText() {
            if (!this.inputText) {
                this.candidateTags = []
                return;
            }
            var res = await this.$api.tag.listByName(this.inputText).catch(e => {});
            this.selectedCandidateIndex = -1;
            var self = this;
            this.candidateTags = res.data.filter(tag => {
                return self.selectedTags.filter(selectedTag => selectedTag.name === tag.name).length === 0;
            })
        }
    },
    methods: {
        onArrowDown(e) {
            if (this.selectedCandidateIndex === (this.candidateTags.length-1)) {
               return;
            }
            this.selectedCandidateIndex++;
        },
        onArrowUp(e) {
            if (this.selectedCandidateIndex === 0) {
                return;
            }
            this.selectedCandidateIndex--;
        },
        onEnter(e) {
            if (this.selectedCandidateIndex === -1) {
                if (this.inputText) {
                   this.addTag({name: this.inputText});
                }
            } else {
                this.addTag(this.candidateTags[this.selectedCandidateIndex]);
            }
        },
        onHover(tag) {
            this.selectedCandidateIndex = this.candidateTags.indexOf(tag);
        },
        async addTag(tag) {
            if (this.selectedTags.length === 0 || this.selectedTags.filter(t => t.name === tag.name).length === 0){
                if (tag.id) {
                    this.selectedTags.push(tag);
                    console.log('add existing tag');
                } else {
                    var resp = await this.$api.tag.getOneByName(tag.name).catch(err => {console.log(err)});
                    console.log(resp);
                    if (resp) {
                        if (resp.data) {
                            this.selectedTags.push(resp.data);
                            console.log('add existing tag from server');
                        } else {
                            this.selectedTags.push(tag);
                            console.log('add new tag');
                        }
                    }
                }
                this.$emit('tagChange', this.selectedTags);
            }
            this.candidateTags = [];
            this.inputText = '';
            this.selectedCandidateIndex = -1;
        },
        highlightIfSelected(tag) {
            if (this.selectedCandidateIndex === -1) {
                return {}
            }

            if (tag == this.candidateTags[this.selectedCandidateIndex]) {
                return {background: '#ccc'}
            } else {
                return {}
            }
        },
        deleteFromSelectedTag(tag) {
            this.selectedTags = this.selectedTags.filter(selectedTag => selectedTag.name !== tag.name);
            this.$emit('tagChange', this.selectedTags);
        }
    }
}
</script>
<style scoped>
.tagSelectorWrapper {
    position: relative;
}

.inputWrapper {
    width: 200px;
    position: relative;
}

.inputWrapper input {
    width: 100%;
    height: 30px;
}

.candidateWrapper {
    position: absolute;
    width: 100%;
    top: 30px;
    background: white;
    border: 1px solid #ccc;
    cursor: pointer;
}

.selectedTagsWrapper {
    display: flex;
    flex-wrap: wrap;
}

.selectedTag {
    margin: 3px;
    padding: 3px 8px;
    background: #0086c3;
    color: white;
    font-size: 10pt;
    border-radius: 3px;
}

.selectedTag-deleteButton {
    display: inline-block;
    margin-left: 10px;
    font-weight: 700;
    cursor: pointer;
}
</style>