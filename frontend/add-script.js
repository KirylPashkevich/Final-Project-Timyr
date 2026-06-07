const fileInput = document.getElementById('image_file')
const preview = document.getElementById('preview-img')
const previewContainer = document.getElementById('preview-section')

// fileInput.addEventListener('change', ()=>{
//     const file = fileInput.files[0];
//     if (file){
//         const tempUrl= URL.createObjectURL(file);
//         previewImg.src = tempUrl;
//         previewImg.style.display = "block";
//     }
// });
const from = document.getElementById('add-item-form')

from.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", document.getElementById('name').value);
    formData.append("storage_sector", document.getElementById('sector').value);
    formData.append("weight", document.getElementById('weight').value);
    formData.append("quantity", document.getElementById('quantity').value);
    formData.append("is_dangerous", document.getElementById('is_dangerous').checked);

    const responce = await fetch("/items", {
        method:"POST",
        body: formData
    });
    if (responce.status ===201){
        alert("Все нормально")
        window.location.href = "index.html"
    }else{
        alert("Плохо")
        console.log(await responce.json)
    }
    
})