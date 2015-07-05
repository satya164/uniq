function uniq(arr, equality) {
    if (typeof equality !== "undefined") {
        if (typeof equality === "function") {
            let result = [];

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

            return result;
        } else {
            throw new TypeError("Invalid equality function");
        }
    } else {
        return arr.filter((item, index) => arr.indexOf(item) === index);
    }
}

export default uniq;
