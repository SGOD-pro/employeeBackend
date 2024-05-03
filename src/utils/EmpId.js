export default function generateUniqueId() {
    const timestamp = Date.now().toString().substr(-6);
    const randomStr = Math.random().toString().substr(2, 5);
    const empId = `EMP_${timestamp}${randomStr}`;
    return empId;
}



