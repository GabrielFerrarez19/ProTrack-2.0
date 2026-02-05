package pgconv

import (
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

//
// TIMESTAMPTZ (with timezone)
//

func TimeToPgTimestamptz(value time.Time) pgtype.Timestamptz {
	if value.IsZero() {
		return pgtype.Timestamptz{Valid: false}
	}
	return pgtype.Timestamptz{
		Time:  value,
		Valid: true,
	}
}

func PgTimestamptzToTime(value pgtype.Timestamptz) time.Time {
	if !value.Valid {
		return time.Time{}
	}
	return value.Time
}

//
// TIME (hour only)
//

func StringToPgTime(value string) (pgtype.Time, error) {
	t, err := time.Parse("15:04:05", value)
	if err != nil {
		return pgtype.Time{}, err
	}

	micro := int64(t.Hour()*3600+t.Minute()*60+t.Second()) * 1_000_000

	return pgtype.Time{
		Microseconds: micro,
		Valid:        true,
	}, nil
}

func TimeToPgTime(value time.Time) pgtype.Time {
	if value.IsZero() {
		return pgtype.Time{Valid: false}
	}

	micro := int64(value.Hour()*3600+value.Minute()*60+value.Second()) * 1_000_000

	return pgtype.Time{
		Microseconds: micro,
		Valid:        true,
	}
}

func PgTimeToTime(value pgtype.Time) time.Time {
	if !value.Valid {
		return time.Time{}
	}

	h := value.Microseconds / (3600 * 1_000_000)
	m := (value.Microseconds % (3600 * 1_000_000)) / (60 * 1_000_000)
	s := (value.Microseconds % (60 * 1_000_000)) / 1_000_000

	return time.Date(0, 1, 1, int(h), int(m), int(s), 0, time.UTC)
}

func PgTimeToString(value pgtype.Time) (string, error) {
	if !value.Valid {
		return "", errors.New("invalid pgtype.Time")
	}

	total := value.Microseconds / 1_000_000
	h := total / 3600
	m := (total % 3600) / 60
	s := total % 60

	return fmt.Sprintf("%02d:%02d:%02d", h, m, s), nil
}
