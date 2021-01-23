<template>
    <div class="wrapper">
        <admin-header></admin-header>
        <div class="bodyWrapper">
            <div class="content">
                <div class="flexRowAlignLeft">
                    <h3>Category</h3>
                      <div class="flexGrow flexRowAlignRight">
                        <span class="category-editButton" @click="startEditingNew()">create new category</span>
                    </div>
                </div>

                <div class="category-el flexRowAlignLeft" v-for="category in categories" :key="category.id">
                    <div class="flexGrow">
                        <div v-if="isEditing(category)">
                            <input type="text" v-model="editingCategory.name"/>
                        </div>
                        <span v-else>{{ category.name }}</span>
                    </div>

                    <div v-if="isEditing(category)">
                        <span class="category-editButton" @click="save()">save</span>
                        <span class="category-editButton" @click="cancel()">cancel</span>
                    </div>

                    <span v-else class="category-editButton" @click="startEditing(category)">edit</span>
                </div>

            </div>
        </div>
    </div>   
</template>
<script>
import AdminHeader from '../components/AdminHeader';

export default {
    async created() {
        this.reloadCategories();
    },
    data() {
        return {
            categories: [],
            editingCategory: null
        }
    },
    methods: {
        isEditing(category) {
            if (!this.editingCategory) {
                return false;
            }

            if (category.id) {
                if (this.editingCategory.id && this.editingCategory.id === category.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.editingCategory.name === category.name) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isEditingSomething() {
            return this.editingCategory;
        },
        startEditing(category) {
            if (this.isEditingSomething()) {
                return;
            }
            this.editingCategory = Object.assign({}, category);
        },
        startEditingNew() {
            if (this.isEditingSomething()) {
                return;
            }
            
            const newCategory = {name: ''};
            this.categories.push(newCategory);
            this.editingCategory = newCategory;
        },
        stopEditing() {
            this.editingCategory = null;
        },
        async save() {
            if (!this.editingCategory.name) {
                alert("category's name must not be blank");
                return;
            }

            await this.$api.category.save(this.editingCategory).catch(e => alert("failed to save"));
            this.stopEditing();
            await this.reloadCategories();
        },
        cancel() {
            if (!this.editingCategory.id) {
                this.categories.pop();
            }
            this.editingCategory = null;
        },
        async reloadCategories() {
            const resp = await this.$api.category.list().catch(e => console.log(e));
            if (resp.data) {
                this.categories = resp.data;
            } else {
                alert("error occurred");
            }
        }
    },
    components: {
        AdminHeader
    }
}
</script>
<style scoped>
.category-el {
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #ccc;
}

.category-editButton {
    margin-left: 20px;
    text-align: center;
    font-size: 10pt;
    text-decoration: underline;
    cursor: pointer;
}
</style>