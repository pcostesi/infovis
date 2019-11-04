grep RestingHeartRate export.xml | cut -d '"' -f 10,16 | sed 's/"/, /g' >hr.csv
