function uniq(arr, equality) {
    let result;

    if (typeof equality !== "undefined") {
        if (typeof equality === "function") {
            result = [];

            for (let a of arr) {
                let has = false;

                for (let b of result) {
                    if (equality(a, b)) {
                        has = true;

                        break;
                    }
                }

                if (!has) {
                    result.push(a);
                }
            }
        } else {
            throw new TypeError("Invalid equality function");
        }
    } else {
        result = arr.filter((item, index) => arr.indexOf(item) === index);
    }

    return result;
}

export default uniq;
