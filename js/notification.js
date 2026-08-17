/* ==========================================
   入浴通知受信
========================================== */

function startNotificationListener(){

    // Firebaseが使えない場合は何もしない
    if(!window.firebaseDB){
        return;
    }

    const notificationRef =
        window.firebaseRef(
            window.firebaseDB,
            "pochan/notification"
        );

    window.firebaseOnValue(
        notificationRef,
        (snapshot) => {

            const data = snapshot.val();

            if(!data){
                return;
            }

            console.log(
                "入浴通知を受信しました",
                data
            );

        }
    );

}
