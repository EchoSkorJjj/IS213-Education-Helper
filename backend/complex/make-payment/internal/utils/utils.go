package utils

import (
	"context"
	"io"
	"log"
	"net/http"
)

func SendHttpRequest(ctx context.Context, method, url string, data io.Reader, headers map[string]string) (*http.Response, error) {
	httpReq, err := http.NewRequestWithContext(ctx, method, url, data)
	if err != nil {
		log.Printf("Failed to create new HTTP request with context: %v", err)
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")
    for k, v := range headers {
        httpReq.Header.Set(k, v)
    }

	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	httpResp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("Failed to send HTTP request: %v", err)
		return nil, err
	}

	return httpResp, nil
}
