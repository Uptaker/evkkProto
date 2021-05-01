# EVKK Proto paigaldamise juhend
Eesti Vahekeele Korpuse prototüüp

### XAMPP või mingi muu riistvara

XAMPP on rakendus, mis paigaldab su arvutisse kõikvajalikud tööriistad, et jooksutada PHP + MySQL + phpMyAdmin serveri
[XAMPP](https://www.apachefriends.org/index.html)

### Andmebaasi importimine

PhpMyAdminiga ei ole see nii lihtne - fail on liiga suur importimiseks.
Sul peab olema Kippari keelekorpus.sql.zip, seda leiate [siin](http://www.tlu.ee/~jaagup/andmed/keel/korpus/)

1. Käivita MySQL ja Apache.
2. Mine localhost/phpMyAdmin
3. Koosta endale tühja andmebaasi
4. Importi sql fail läbi cmd/powershelli koostatud andmebaasi - [Googeldage](https://dba.stackexchange.com/questions/24371/how-to-import-a-sql-file-in-mysql)
5. Importimisel -u on root ja -p on tühi
6. Kui sisestasid käsu ja cmd ei teinud midagi (kui kõik on õige, siis ei peaks), siis kontrolli phpMyAdmini, kas oli importitud

### EVKK jooksutamine

1. Pulli/klooni/tõmba repo alla
2. Paigalda failid htdocs kausta C:\xampp\htdocs\ (näiteks C:\xampp\htdocs\evkkProto)
3. Käivita Apache ja MySQL
4. Kirjuta localhost brauserisse ja proovi, kas toimib

### Mis failid teevad mida

Olen kommenteerinud koodis iga funktsiooni, vaadake üle ja katsetage aru saada xd.

#### db
- db.php - sisaldab andmebaasi ühendamiseks andmed (user, pass etc)
- server.php - Siia suunavad kõik ajax päringud

#### scripts
- echarts.js - Echarts raamistik, ära puutu pls
- stats.js - kõik js kood, ajaxid, echartsid, checkmarkide stiilimine etc

#### css
- style.css - stylesheet

#### img
- Praegu seal on ainult logo.img, ehk pealkirja juures olev roheline TLU logo


