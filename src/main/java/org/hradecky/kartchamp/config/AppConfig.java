package org.hradecky.kartchamp.config;

import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

@Configuration
//@ImportResource( { "classpath*:/rest_config.xml" } )
@ComponentScan(basePackages = "org.hradecky.kartchamp")
//@PropertySource({ "classpath:rest.properties", "classpath:web.properties" })
public class AppConfig {
    /*@Bean
    public PropertySourcesPlaceholderConfigurer properties() {
        return new PropertySourcesPlaceholderConfigurer();
    } */
}