let month = function(m){
    if(m == 1)
        return "Jan";
    else if(m == 2)
        return "Feb";
    if(m == 3)
        return "March";
    if(m == 4)
        return "April";
    if(m == 5)
        return "May";
    if(m == 6)
        return "June";
    if(m == 7)
        return "July";
    if(m == 8)
        return "August";
    if(m == 9)
        return "Sept";
    if(m == 10)
        return "Oct";
    if(m == 11)
        return "Nov";
    if(m == 12)
        return "Dec";
}

module.exports.jsTime = function(createdAt){
    let time = Date.now() - createdAt;
    time /= 1000;

    if(time/60 < 1)
        return `${parseInt(time)}s ago`;
    else if(time/(60*60) < 1)
        return `${parseInt(time/60)} min`;
    else if(time/(60*60*24) < 1)
        return `${parseInt(time/(60*60))} hr`;
    else if(time/(60*60*24*365) < 1)
        return `${createdAt.getDate()} ${month(createdAt.getMonth())}`;
    else    
    {
        let yr = `${createdAt.getDate()} ${month(createdAt.getMonth())}`;
        yr += " 20"+`${createdAt.getYear()}`.substr(1);
        return yr;
    } 
}

module.exports.time = (app) => {
    app.locals.time = function(createdAt){
        let time = Date.now() - createdAt;
        time /= 1000;

        if(time/60 < 1)
            return `${parseInt(time)}s ago`;
        else if(time/(60*60) < 1)
            return `${parseInt(time/60)} min`;
        else if(time/(60*60*24) < 1)
            return `${parseInt(time/(60*60))} hr`;
        else if(time/(60*60*24*365) < 1)
            return `${createdAt.getDate()} ${month(createdAt.getMonth())}`;
        else    
        {
            let yr = `${createdAt.getDate()} ${month(createdAt.getMonth())}`;
            yr += " 20"+`${createdAt.getYear()}`.substr(1);
            return yr;
        } 
    }
}
