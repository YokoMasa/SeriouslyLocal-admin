<template>
    <div class="modalBase flexCenter">
        <div class="modalWrapper">
            <div class="modalBodyWrapper">
                {{ content }}
            </div>
            <div class="modalButtonWrapper">
                <button @click="onNo">No</button>
                <button @click="onYes" class="importantButton">Yes</button>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
    props: ['content'],
    methods: {
        onYes() {
            this.$emit("yes");
        },
        onNo() {
            this.$emit("no")
        }
    }
}
</script>
<style scoped>
button {
    margin: 0 5px;
    padding: 7px 25px;
}

.modalWrapper {
    width: 300px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #ccc;
}

.modalBodyWrapper {
    min-height: 70px;
    flex: 1 1;
}

.modalButtonWrapper {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>