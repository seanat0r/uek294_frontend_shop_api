class IndexController {

    static initialize() {
        IndexController.divisor = 7;
        IndexController.alertMessage();

    }

    static divide(dividend) {
        if (dividend % IndexController.divisor === 0) {
            return true;
        } else {
            return false;
        }
    }

    static alertMessage() {
        for (let i = 0; i < 100; i++) {
            if (this.divide(i)) {
                alert(`${i} ist durch ${IndexController.divisor} teilbar!`)
            }
        }
    }
}

IndexController.initialize();