//Dropdown comparison code
const drop1 = document.getElementById("capitals_1");
const drop2 = document.getElementById("capitals_2");

function updateOptions() {
    const val1 = drop1.value;
    const val2 = drop2.value;

    Array.from(drop2.options).forEach(opt => {
        opt.disabled = (opt.value && opt.value === val1);
    });

    Array.from(drop1.options).forEach(opt => {
        opt.disabled = (opt.value && opt.value === val2);
    });
}

drop1.addEventListener('change', updateOptions);
drop2.addEventListener('change', updateOptions);
